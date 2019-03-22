const express = require('express');

const router = express.Router();
const { SignupValidator } = require('../passport/SignupValidator');
const { User } = require('../database/models/User');
const passport = require('../passport');

router.post('/', async (req, res) => {
  console.log('post /');
  try {
    console.log('user signup');

    const { username, password } = req.body;
    const user = await User.findOne({ username });

    const credentialValidation = SignupValidator.validate({ username, password });

    if (user) { // user already exists
      console.log('user already exists');
      res
        .status(400)
        .json({
          message: `Sorry, a user already exists with the username: ${username}`,
          user: null,
        });
    } else if (!credentialValidation.valid) {
      console.log('!credentialValidation')
      res
        .status(400)
        .json({
          message: credentialValidation.message,
          user: null,
        });
    } else {
      console.log('new user created');
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
    console.log('error');
    res
      .status(500)
      .json({
        message: err,
        user: null,
      });
    console.error('User.js post error: ', err);
  }
});

router.get('/', (req, res) => { // this is hijacking all routes in yarn dev
  console.log('get /');
  console.log('req.user: ', req.user);
  if (req.user) {
    console.log('logged in');
    res
      .status(200)
      .json({
        message: 'OK',
        user: req.user,
      });
  } else {
    console.log('no user logged in');
    res
      .status(200)
      .json({
        message: 'No user logged in',
        user: null,
      });
  }
});

router.post('/login', (req, res, next) => {
  console.log('post login');
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
  console.log('post logout');
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
  console.log('post schedule');
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
