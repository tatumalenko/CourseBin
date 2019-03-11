const mongoose = require('mongoose');
const _ = require('lodash');

const { Timetable } = require('../../models/Timetable');
const configs = require('../../../../configs/configs');
const timetable = require('../parsed/timetable');

mongoose.connect(configs.dbMongo.dbPath, { useNewUrlParser: true, useCreateIndex: true });

timetable.getTimetableCourses().then(async (courses) => {
  console.log(courses);
  const uniqCourses = _.uniqWith(
    courses,
    (c1, c2) => c1.courseCode === c2.courseCode &&
      c1.code === c2.code &&
      c1.term === c2.term &&
      c1.mode === c2.mode &&
      c1.kind === c2.kind,
  );
  const ok = await Timetable.insertMany(uniqCourses);
  console.log(ok);
}).catch((err) => {
  console.error(err);
});
