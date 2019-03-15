const express = require('express');

const router = express.Router();
const passwordValidator = require('password-validator');
const { User } = require('../database/models/User');
const passport = require('../passport');

// const { User } = require('../database/models/User');
// const passport = require('../passport/index');


router.post('/', async (req, res) => {
  try {
    console.log('user signup');

    const { username, password } = req.body;
    const user = await User.findOne({ username });

    const passwordRules = new passwordValidator();
    console.log(passwordRules);

    // password rules
    passwordRules
      .is().min(6) // minimum length of 6
      .is().max(20) // maximum length of 20
      .has()
      .not()
      .spaces() // no spaces allowed
      .has()
      .lowercase() // must have lowercase letters
      .is()
      .not()
      .oneOf([ username, 'password', 'abcdef', '123456' ]); // list of invalid passwords


    if (user) { // user already exists
      res
        .status(400)
        .json({
          message: `Sorry, a user already exists with the username: ${username}`,
          user: null,
        });
    } else if (passwordRules.validate(password)) { // valid password
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
    } else { // password does not respect the rules
      if (username === password) {
        res
          .status(400)
          .json({
            message: 'Username and password cannot be the same.',
          });
      }
      if (username.is().oneOf([ 'password', 'abcdef', '123456' ])) { // password too simple
        res
          .status(400)
          .json({
            message: 'Password is too simple.',
          });
      }
      if (username.has().not().lowercase()) { // password does not have any lowercase letters
        res
          .status(400)
          .json({
            message: 'Password must contain lowercase letters.',
          });
      }
      if (password.length < 6) { // password too short
        res
          .status(400)
          .json({
            message: 'Password must be 6 characters or more.',
          });
      }
      if (password.has().spaces()) { // password contains spaces
        res
          .status(400)
          .json({
            message: 'Password cannot contain spaces.',
          });
      }
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
