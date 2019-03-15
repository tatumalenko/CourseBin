const mongoose = require('mongoose');

const Timetable = require('./Timetable');
const configs = require('../../../configs/configs');
const compCourses = require('../../openapi/scripts/comp_parsed.json');
const soenCourses = require('../../openapi/scripts/soen_parsed.json');

mongoose.connect(configs.dbMongo.dbPath);

const apiCourses = [ ...compCourses, ...soenCourses ];

const offerings = [];

// eslint-disable-next-line no-restricted-syntax
for (const apiCourse of apiCourses) {
  const course = {
    title: apiCourse.courseTitle,
    code: `${apiCourse.subject}${apiCourse.catalog}`,
    credits: 0,
    prerequisiteCodes: [ '' ],
    successorCodes: [ '' ],
  };
  const timeBlocks = [];
  const section = {
    course,
    code: apiCourses.section,
    term: '',
    location: {
      code: apiCourse.roomCode,
      room: apiCourse.room,
      building: apiCourse.buildingCode,
    },
    kind: apiCourse.componentCode,
    times: timeBlocks,
  };
  offerings.push(section);
}

const timetable = new Timetable(offerings);
timetable.save();
