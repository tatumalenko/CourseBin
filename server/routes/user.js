const express = require('express');

const router = express.Router();
const User = require('../database/models/User');
const passport = require('../passport');

router.post('/', async (req, res) => {
  try {
    console.log('user signup');

    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user) {
      res
        .status(400)
        .json({
          message: `Sorry, a user already exists with the username: ${username}`,
        });
    } 
    else if(username == password){
      res
      .status(400)
      .json({
        message: `Username and password cannot be the same.`,
      });
    }
    else if(password.length < 6){
      res
      .status(400)
      .json({
        message: `Password must be 6 characters or more.`,
      });
    }
    else {
      const newUser = new User({
        username,
        password,
      });
      const savedUser = await newUser.save();
      res.json(savedUser);
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
