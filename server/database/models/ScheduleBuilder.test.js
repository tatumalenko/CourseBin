const mongoose = require('mongoose');

const { ScheduleBuilder } = require('./ScheduleBuilder');
const { SoftwareEngineeringDegree } = require('./SoftwareEngineeringDegree');
const configs = require('../../../configs/configs');

mongoose.connect(configs.dbMongo.dbPath, { useNewUrlParser: true, useCreateIndex: true });

const student = {
  id: 40055122,
  name: {
    first: 'Tatum',
    last: 'Alenko',
  },
  record: {
    gpa: 3.5,
    standing: 'ACCEPTABLE',
    completedCourses: [
      { code: 'MATH203', grade: 'A' },
      { code: 'MATH204', grade: 'A' },
      { code: 'MATH205', grade: 'A' },
      { code: 'COMP232', grade: 'A' },
      { code: 'COMP248', grade: 'A' },
      { code: 'COMP249', grade: 'A' },
      { code: 'COMP352', grade: 'A' },
      { code: 'SOEN228', grade: 'A' },
      { code: 'SOEN287', grade: 'A' },
    ],
  },
};

console.log(
  ScheduleBuilder.findUncompletedCourses(
    {
      completedCourses: student.record.completedCourses.map(e => e.code),
      requiredCourses: SoftwareEngineeringDegree.requirements.mandatory,
    },
  ),
);

ScheduleBuilder.findCandidateCourses(
  {
    completedCourses: student.record.completedCourses.map(e => e.code),
    requiredCourses: SoftwareEngineeringDegree.requirements.mandatory,
  },
).then(candidateCourses => console.log(candidateCourses));

ScheduleBuilder.findCandidateSchedules(
  {
    completedCourses: student.record.completedCourses.map(e => e.code),
    requiredCourses: SoftwareEngineeringDegree.requirements.mandatory,
    term: 'FALL',
  },
).then(candidateCourses => console.log(candidateCourses));
