const express = require('express');

const router = express.Router();
const passport = require('../passport');
const { SignupValidator } = require('../passport/SignupValidator');
const { User } = require('../database/models/User');
const { Student } = require('../database/models/Student');
const { ProgramBuilder } = require('../database/models/ProgramBuilder');
const { Preferences } = require('../database/models/Preferences');
const { SoftwareEngineeringDegree } = require('../database/models/SoftwareEngineeringDegree');
const { Plan } = require('../database/models/Plan');

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
      console.log('!credentialValidation');
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
      .status(404)
      .json({
        message: 'No user logged in',
        user: null,
      });
  }
});

router.get('/student', async (req, res) => {
  const { user } = req;
  if (user && (!!Number(user.username) || !!user.studentId)) {
    let student = await Student.findOne({
      id: user.studentId ?
        user.studentId : user.username,
    });
    if (student) {
      const studentId = student.id;
      student = student.toObject({
        getters: true,
        virtuals: true,
        versionKey: false,
        transform: (doc, ret) => {
          [ '_id', 'id' ].forEach((key) => {
            // eslint-disable-next-line
            delete ret[key];
          });
        },
      });
      student = { id: studentId, ...student };
      console.log(student);
    }
    res
      .status(200)
      .json({
        message: 'OK',
        user,
        student,
      });
  } else {
    const message = !user ? 'No user logged in' : 'No student associated to user';
    console.log(message);
    res
      .status(404)
      .json({
        message,
        user: null,
        student: null,
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

router.post('/plan', async (req, res) => {
  console.log('post plan');
  try {
    if (req.user) {
      const preferences = new Preferences({
        fall: req.body.fall,
        winter: req.body.winter,
        summer: req.body.summer,
      });
      const student = req.body.student ? req.body.student : await Student.findOne({ id: req.user.username }); // ? await Student.findOne({ id: student.id }) : ;
      const plan = await ProgramBuilder.findCandidatePlan({
        completedCourses: student && student.record ? student.record.completedCourses : [],
        requiredCourses: SoftwareEngineeringDegree.requirements(
          student && student.record ? student.record.degree.option : 'GENERAL',
        ),
        preferences,
      });
      res
        .status(200)
        .json({
          message: 'OK',
          plan: new Plan({
            schedules: {
              fall: plan.schedules.fall.slice(0, 50),
              winter: plan.schedules.winter,
              summer: plan.schedules.summer,
            },
            sequences: plan.sequences,
          }),
          unableToAddReasonsMap: preferences.unableToAddReasonsMap,
        });
    } else {
      res
        .status(404)
        .json({ message: 'No user logged in' });
    }
  } catch (e) {
    console.error('routes.js: /user/plan:', e);
    res
      .status(500)
      .json({ message: e.message });
  }
  console.log('post plan request sent!');
});

module.exports = router;
