const mongoose = require('mongoose');

const { Schema } = mongoose;
const configs = require('../../../configs/configs');
// const { nameSchema } = require('./Student');
// const { courseSchema } = require('./Catalog');

const classLocationSchema = new Schema({
  code: { type: String, unique: false, required: false },
  room: { type: String, unique: false, required: false },
  building: { type: String, unique: false, required: false },
});

// const professorSchema = new Schema({
//   name: { type: nameSchema, unique: false, required: true },
// });

const timeBlockSchema = new Schema({
  startTime: { type: String, unique: false, required: true },
  endTime: { type: String, unique: false, required: true },
  weekDay: {
    type: String,
    enum: [ 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY' ],
    unique: false,
    required: true,
  },
});

const sectionSchema = new Schema({
  courseCode: { type: String, unique: false, require: true },
  code: { type: String, unique: false, required: true },
  term: {
    type: String,
    enum: [ 'FALL', 'WINTER', 'FALL/WINTER', 'SPRING', 'SUMMER', 'SPRING/SUMMER' ],
    unique: false,
    required: true,
  },
  mode: { type: String, unique: false, required: true },
  location: { type: classLocationSchema, unique: false, required: false },
  kind: {
    type: String,
    enum: [ 'LEC', 'TUT', 'LAB', 'ONL' ],
    unique: false,
    required: true,
  },
  // professor: { type: professorSchema, unique: false, required: true },
  times: { type: [ timeBlockSchema ], unique: false, required: true },
  dates: { type: [ String ], unique: false, required: true },
});

module.exports = {
  Timetable: mongoose.model('Timetable',
    sectionSchema,
    configs.dbMongo.schemaCollectionNames.timetable),
  sectionSchema,
};

// new Schema({
//   offerings: { type: [ sectionSchema ], unique: false, required: true },
// })
