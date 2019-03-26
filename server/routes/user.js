const express = require('express');

const router = express.Router();
const { SignupValidator } = require('../passport/SignupValidator');
const { User } = require('../database/models/User');
const passport = require('../passport');

router.post('/', async (req, res) => {
  try {
    console.log('user signup');

    const { username, password } = req.body;
    const user = await User.findOne({ username });

    const credentialValidation = SignupValidator.validate({ username, password });

    if (user) { // user already exists
      res
        .status(400)
        .json({
          message: `Sorry, a user already exists with the username: ${username}`,
          user: null,
        });
    } else if (!credentialValidation.valid) {
      res
        .status(400)
        .json({
          message: credentialValidation.message,
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
  if (req.user) {
    // const { preferences } = req.body;

    // Example preferences contents:
    // {
    //   fall: {
    //     numberOfCourses: 4,
    //     eveningTimePreference: true,
    //     requestedCourses: [ 'COMP352', 'COMP348' ],
    //   },
    //   winter: {
    //     numberOfCourses: 4,
    //     eveningTimePreference: true,
    //     requestedCourses: [ 'COMP***', 'COMP***' ],
    //   },
    //   summer: {
    //     numberOfCourses: 4,
    //     eveningTimePreference: true,
    //     requestedCourses: [ 'COMP***', 'COMP***' ],
    //   },
    // };

    // const student = Student.find({id: req.user.id });
    // const plan = ProgramBuilder.findCandidatePlan({
    //   completedCourses: student.completedCourses,
    //   requiredCourses: SoftwareEngineeringDegree.requirements(student.record.degree.option),
    //   preferences
    // });
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
