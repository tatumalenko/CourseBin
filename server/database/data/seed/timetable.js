const mongoose = require('mongoose');

const { Timetable } = require('../../models/Timetable');
const configs = require('../../../../configs/configs');
const timetable = require('../parsed/timetable');

mongoose.connect(configs.dbMongo.dbPath, { useNewUrlParser: true, useCreateIndex: true });

timetable.getTimetableCourses().then(async (courses) => {
  console.log(courses);
  const ok = await Timetable.insertMany(courses);
  console.log(ok);
}).catch((err) => {
  console.error(err);
});
