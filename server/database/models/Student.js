const mongoose = require('mongoose');

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
  gpa: { type: Number, unique: false, required: false },
  // agpa: { type: Number, unique: false, required: false },
  // cgpa: { type: Number, unique: false, required: false },
  standing: {
    type: String,
    enum: [ 'ACCEPTABLE', 'CONDITIONAL', 'FAILED' ],
    unique: true,
    required: false,
  },
  completedCourses: { type: [ completedCourseSchema ], unique: false, required: false },
});

const scheduleSchema = new Schema({
  term: {
    type: String,
    enum: [ 'FALL', 'WINTER', 'SPRING', 'SUMMER' ],
    unique: false,
    required: true,
  },
  sections: { type: sectionSchema, unique: false, required: true },
});

module.exports = {
  Student: mongoose.model('Student',
    new Schema({
      id: { type: Number, unique: true, required: true },
      name: { type: nameSchema, unique: false, required: true },
      record: { type: recordSchema, unique: false, required: false },
      sequence: { type: [ scheduleSchema ], unique: false, required: false },
    }),
    configs.dbMongo.schemaCollectionNames.student),
  nameSchema,
};

// const student = {
//   id: 40055122,
//   name: {
//     first: 'Tatum',
//     last: 'Alenko',
//   },
//   record: {
//     gpa: 3.5,
//     standing: 'ACCEPTABLE',
//     completedCourses: [
//       'MATH203',
//       'MATH204',
//       'MATH205',
//     ],
//   },
// };