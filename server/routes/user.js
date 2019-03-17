const express = require('express');

const router = express.Router();
<<<<<<< HEAD
<<<<<<< HEAD
const { User } = require('../database/models/User');
const passport = require('../passport/index');
=======
const User = require('../database/models/User');
const passport = require('../passport');
const passwordValidator = require('password-validator');
<<<<<<< HEAD
>>>>>>> e125ee2... changed password validation to be more robust
=======
<<<<<<< HEAD
<<<<<<< HEAD
const { SignupValidator } = require('../passport/SignupValidator');
const { User } = require('../database/models/User');
const passport = require('../passport');
=======
const passwordValidator = require('password-validator');
const { User } = require('../database/models/User');
const passport = require('../passport');

// const { User } = require('../database/models/User');
// const passport = require('../passport/index');

>>>>>>> 2434598... [#41] Merged master into branch, fixed conflicts
=======
>>>>>>> e125ee2... changed password validation to be more robust

=======
const PasswordValidator = require('password-validator');
=======
const { SignupValidator } = require('../passport/SignupValidator');
>>>>>>> f072e1d... [#41] Abstract signup validation logic into separate class and add tests
const { User } = require('../database/models/User');
const passport = require('../passport');
>>>>>>> 37d606fc13b8e09ecfa456de7d62e6b3d4faeb45

>>>>>>> 9616f34... [#41] Fix username validation and simplify control flow
router.post('/', async (req, res) => {
  try {
    console.log('user signup');

    const { username, password } = req.body;
    const user = await User.findOne({ username });

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> e125ee2... changed password validation to be more robust
    var passwordRules = new passwordValidator();

    // password rules
    passwordRules
    .is().min(6)  // minimum length of 6
    .is().max(20) // maximum length of 20
    .has().not().spaces() // no spaces allowed
<<<<<<< HEAD
<<<<<<< HEAD
    .has().lowercase() // must have lowercase letters
    .is().not().oneOf([username, 'password', 'abcdef', '123456']); // list of invalid passwords
    
=======
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    const credentialValidation = SignupValidator.validate({ username, password });
=======
    const passwordRules = new passwordValidator();
    console.log(passwordRules);
=======
    const passwordRules = new PasswordValidator();
    const usernameRules = new PasswordValidator();

    // Username rules
    usernameRules
      .is().min(8) // Minimum length 8
      .is().max(100) // Maximum length 100
      .has().not().spaces(); // Should not have spaces
>>>>>>> 9616f34... [#41] Fix username validation and simplify control flow

    // Password rules
    passwordRules
      .is().min(8) // Minimum length 8
      .is().max(100) // Maximum length 100
      .has().not().spaces() // Should not have spaces
      .has().uppercase() // Must have uppercase letters
      .has().lowercase() // Must have lowercase letters
      .has().digits() // Must have digits
      .is().not().oneOf([ 'Passw0rd', 'Password123' ]); // Blacklist these values

<<<<<<< HEAD
>>>>>>> 2434598... [#41] Merged master into branch, fixed conflicts
=======
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
>>>>>>> 9616f34... [#41] Fix username validation and simplify control flow
=======
    const credentialValidation = SignupValidator.validate({ username, password });
>>>>>>> f072e1d... [#41] Abstract signup validation logic into separate class and add tests
>>>>>>> 37d606fc13b8e09ecfa456de7d62e6b3d4faeb45
=======
    .is().not().oneOf([username, 'password']); // list of invalid passwords
=======
    .has().lowercase() // must have lowercase letters
    .is().not().oneOf([username, 'password', 'abcdef', '123456']); // list of invalid passwords
>>>>>>> 851dc19... added check for lowercase letters
    
>>>>>>> e125ee2... changed password validation to be more robust

    if (user) { // user already exists
      res
        .status(400)
        .json({
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
          message: `Sorry, a user already exists with the username: ${username}`,
          user: null,
        });
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    } else if (!credentialValidation.valid) {
      res
        .status(400)
        .json({
          message: credentialValidation.message,
          user: null,
        });
    } else {
=======
    } else if (passwordRules.validate(password)) { // valid password
>>>>>>> 2434598... [#41] Merged master into branch, fixed conflicts
=======
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
=======
    } else if (!credentialValidation.valid) {
>>>>>>> f072e1d... [#41] Abstract signup validation logic into separate class and add tests
      res
        .status(400)
        .json({
          message: credentialValidation.message,
          user: null,
        });
    } else {
<<<<<<< HEAD
=======
          message: 'Sorry, a user already exists with the username: ${username}',
=======
          `Sorry, a user already exists with the username: ${user.username}`
>>>>>>> 0d14ded... Update server/routes/user.js
        });
    }
    else if (passwordRules.validate(password)) { // valid password
>>>>>>> e125ee2... changed password validation to be more robust
=======
>>>>>>> 9616f34... [#41] Fix username validation and simplify control flow
>>>>>>> 37d606fc13b8e09ecfa456de7d62e6b3d4faeb45
=======
          message: 'Sorry, a user already exists with the username: ${username}',
        });
    }
    else if (passwordRules.validate(password)) { // valid password
>>>>>>> e125ee2... changed password validation to be more robust
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
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
>>>>>>> 2434598... [#41] Merged master into branch, fixed conflicts
=======
>>>>>>> 9616f34... [#41] Fix username validation and simplify control flow
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
    else { // invalid password
      if (username.equals(password)) {
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
