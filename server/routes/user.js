const express = require('express');

const router = express.Router();
const User = require('../database/models/User');
const passport = require('../passport');
const passwordValidator = require('password-validator');

router.post('/', async (req, res) => {
  try {
    console.log('user signup');

    const { username, password } = req.body;
    const user = await User.findOne({ username });

    var passwordRules = new passwordValidator();

    // password rules
    passwordRules
    .is().min(6)  // minimum length of 6
    .is().max(20) // maximum length of 20
    .has().not().spaces() // no spaces allowed
    .has().lowercase() // must have lowercase letters
    .is().not().oneOf([username, 'password', 'abcdef', '123456']); // list of invalid passwords
    

    if (user) { // user already exists
      res
        .status(400)
        .json({
          `Sorry, a user already exists with the username: ${user.username}`
        });
    }
    else if (passwordRules.validate(password)) { // valid password
      const newUser = new User({
        username,
        password,
      });
      const savedUser = await newUser.save();
      res.json(savedUser);
    }
    else { // invalid password
      if (username === password) {
        res
        .status(400)
        .json({
          message: 'Username and password cannot be the same.',
        });
      }
      if (password.length < 6) {
        res
        .status(400)
        .json({
        message: 'Password must be 6 characters or more.',
        });
      }
      if (password.has().spaces()) {
        res
        .status(400)
        .json({
        message: 'Password cannot contain spaces',
        });
      }
    }
  } catch (err) {
    res.status(500).json(err);
    console.error('User.js post error: ', err);
  }
});

router.post(
  '/login',
  (req, res, next) => {
    console.log('req.body: ', req.body);
    next();
  },
  passport.authenticate('local'),
  (req, res) => {
    console.log('req.user: ', req.user);
    res.send({
      username: req.user.username,
    });
  },
);

router.get('/', (req, res, next) => {
  console.log('req.user: ', req.user);
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.json({ user: null });
  }
});

router.post('/logout', (req, res) => {
  if (req.user) {
    req.logout();
    res.send({ message: 'Logging out.' });
  } else {
    res.send({ message: 'No user to log out.' });
  }
});

module.exports = router;
