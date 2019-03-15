const express = require('express');

const router = express.Router();
const PasswordValidator = require('password-validator');
const { User } = require('../database/models/User');
const passport = require('../passport');

router.post('/', async (req, res) => {
  try {
    console.log('user signup');

    const { username, password } = req.body;
    const user = await User.findOne({ username });

    const passwordRules = new PasswordValidator();
    const usernameRules = new PasswordValidator();

    // Username rules
    usernameRules
      .is().min(8) // Minimum length 8
      .is().max(100) // Maximum length 100
      .has().not().spaces(); // Should not have spaces

    // Password rules
    passwordRules
      .is().min(8) // Minimum length 8
      .is().max(100) // Maximum length 100
      .has().not().spaces() // Should not have spaces
      .has().uppercase() // Must have uppercase letters
      .has().lowercase() // Must have lowercase letters
      .has().digits() // Must have digits
      .is().not().oneOf([ 'Passw0rd', 'Password123' ]); // Blacklist these values

    const usernameValidatorMessageMap = {
      min: 'Username must be 6 characters or more.',
      max: 'Username must be 100 characters or less.',
      spaces: 'Username cannot contain spaces.',
    };

    const passwordValidatorMessageMap = {
      min: 'Password must be 6 characters or more.',
      max: 'Password must be 100 characters or less.',
      spaces: 'Password cannot contain spaces.',
      uppercase: 'Password must contain uppercase letters.',
      lowercase: 'Password must contain lowercase letters.',
      digits: 'Password must contain at least 1 digit.',
      oneOf: 'Password is too simple.',
    };

    if (user) { // user already exists
      res
        .status(400)
        .json({
          message: `Sorry, a user already exists with the username: ${username}`,
          user: null,
        });
    } else if (username === password) {
      res
        .status(400)
        .json({
          message: 'Username and password cannot be the same.',
          user: null,
        });
    } else if (!usernameRules.validate(username)) {
      const reasons = usernameRules.validate(username, { list: true });
      res
        .status(400)
        .json({
          message: usernameValidatorMessageMap[reasons[0]],
          user: null,
        });
    } else if (!passwordRules.validate(password)) {
      const reasons = passwordRules.validate(password, { list: true });
      res
        .status(400)
        .json({
          message: passwordValidatorMessageMap[reasons[0]],
          user: null,
        });
    } else {
      const newUser = new User({
        username,
        password,
      });
      const savedUser = await newUser.save();
      res
        .status(200)
        .json({
          message: 'OK',
          user: savedUser,
        });
    }
  } catch (err) {
    res
      .status(500)
      .json({
        message: err,
        user: null,
      });
    console.error('User.js post error: ', err);
  }
});

router.get('/', (req, res) => {
  console.log('req.user: ', req.user);
  if (req.user) {
    res
      .status(200)
      .json({
        message: 'OK',
        user: req.user,
      });
  } else {
    res
      .status(404)
      .json({
        message: 'No user logged in',
        user: null,
      });
  }
});

router.post('/login', (req, res, next) => {
  console.log('req.body: ', req.body);
  next();
},
passport.authenticate('local'),
(req, res) => {
  console.log('req.user: ', req.user);
  res
    .status(200)
    .json({
      message: 'OK',
      user: req.user,
    });
});

router.post('/logout', (req, res) => {
  if (req.user) {
    req.logout();
    res
      .status(200)
      .json({ message: 'User logged out' });
  } else {
    res
      .status(404)
      .json({ message: 'No user to log out' });
  }
});

router.post('/schedule', (req, res) => {
  // const preferences = req.body;

  if (req.user) {
    res
      .status(200)
      .json({ message: 'Not implemented yet' });
  } else {
    res
      .status(404)
      .json({ message: 'No user logged in' });
  }
});

module.exports = router;
