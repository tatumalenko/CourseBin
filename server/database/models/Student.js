const mongoose = require('mongoose');
const _ = require('lodash');

const { Schema } = mongoose;
const configs = require('../../../configs/configs');
const { sectionSchema } = require('./Timetable');

const nameSchema = new Schema({
  first: { type: String, unique: false, required: true },
  last: { type: String, unique: false, required: true },
});

const completedCourseSchema = new Schema({
  code: { type: String, unique: false, required: true },
  grade: { type: String, unique: false, required: true },
});

const recordSchema = new Schema({
  // gpa: { type: Number, unique: false, required: false },
  // standing: {
  //   type: String,
  //   enum: [ 'ACCEPTABLE', 'CONDITIONAL', 'FAILED' ],
  //   unique: true,
  //   required: false,
  // },
  completedCourses: { type: [ completedCourseSchema ], unique: false, required: false },
});

const termSchema = new Schema({
  term: {
    type: String,
    enum: [ 'FALL', 'WINTER', 'SPRING', 'SUMMER' ],
    unique: false,
    required: true,
  },
});

const scheduleSchema = new Schema({
  term: { type: termSchema, unique: false, required: true },
  sections: { type: sectionSchema, unique: false, required: true },
});

const sequenceSchema = new Schema({
  term: { type: termSchema, unique: false, required: true },
  courses: { type: [ String ], unique: false, required: true },
});

const planSchema = new Schema({
  schedules: { type: [ scheduleSchema ], unique: false, required: true },
  sequences: { type: [ sequenceSchema ], unique: false, required: true },
});

const studentSchema = new Schema({
  id: { type: Number, unique: true, required: true },
  name: { type: nameSchema, unique: false, required: true },
  record: { type: recordSchema, unique: false, required: false },
  plans: { type: [ planSchema ], unique: false, required: false },
});

// Define method that calculates the student's gpa based on completed courses
// eslint-disable-next-line
studentSchema.virtual('gpa').get(function () {
  const gradePointMap = {
    'A+': 4.3,
    'A': 4.0,
    'A-': 3.7,
    'B+': 3.3,
    'B': 3.0,
    'B-': 2.7,
    'C+': 2.3,
    'C': 2.0,
    'C-': 1.7,
    'D+': 1.3,
    'D': 1.0,
    'D-': 0.7,
    'F': 0.0,
    'FNS': 0.0,
    'R': 0.0,
    'NR': 0.0,
  };

  // Assume if course was not transfer credit (TRC), then it is worth 3,0 credits
  // i.e. TRC does not count towards gpa calculation
  const completedCoursesCredits = this.record.completedCourses.map(
    e => (e.grade === 'TRC' ? 0.0 : 3.0),
  );

  const weightGpaCreditSum = _.sum(this.record.completedCourses.map(
    (e, i) => completedCoursesCredits[i] * gradePointMap[e.grade],
  ));

  return (weightGpaCreditSum / _.sum(completedCoursesCredits)).toFixed(2);
});

// Define method that assesses student's standing based on gpa
// eslint-disable-next-line
studentSchema.virtual('standing').get(function () {
  const gpa = Number(this.gpa);
  let standing;

  if (gpa >= 2.00) {
    standing = 'ACCEPTABLE';
  } else if (gpa >= 1.50) {
    standing = 'CONDITIONAL';
  } else {
    standing = 'FAILED';
  }

  return standing;
});

// eslint-disable-next-line
studentSchema.methods.savePlan = async function (plan) {
  // Add the plan to the array attribute
  this.plans.push(plan);
  await this.save();
};


module.exports = {
  Student: mongoose.model('Student',
    studentSchema,
    configs.dbMongo.schemaCollectionNames.student),
  nameSchema,
};
