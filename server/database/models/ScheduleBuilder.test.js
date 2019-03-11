const test = require('ava');
const mongoose = require('mongoose');

const { ScheduleBuilder } = require('./ScheduleBuilder');
const { SoftwareEngineeringDegree } = require('./SoftwareEngineeringDegree');
const { Util } = require('../../util/Util');
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

// console.log(
//   ScheduleBuilder.findUncompletedCourses(
//     {
//       completedCourses: student.record.completedCourses.map(e => e.code),
//       requiredCourses: SoftwareEngineeringDegree.requirements.mandatory,
//     },
//   ),
// );

// ScheduleBuilder.findCandidateCourses(
//   {
//     completedCourses: student.record.completedCourses.map(e => e.code),
//     requiredCourses: SoftwareEngineeringDegree.requirements.mandatory,
//   },
// ).then(candidateCourses => console.log(candidateCourses));

// ScheduleBuilder.findCandidateSectionQueueMap(
//   {
//     completedCourses: student.record.completedCourses.map(e => e.code),
//     requiredCourses: SoftwareEngineeringDegree.requirements.mandatory,
//     term: 'FALL',
//   },
// ).then((candidateCourses) => {
//   console.log(candidateCourses);
//   const soen331 = ScheduleBuilder.categorizeSectionQueueIntoKind(
// candidateCourses.get('SOEN331'));
//   console.log(soen331);
// });

test('Categorizing', async (t) => {
  const candidateCourses = await ScheduleBuilder.findCandidateSectionQueueMap(
    {
      completedCourses: student.record.completedCourses.map(e => e.code),
      requiredCourses: SoftwareEngineeringDegree.requirements.mandatory,
      term: 'FALL',
    },
  );

  const categorized = {};
  const allCombos = {};

  t.log(candidateCourses.get('COMP348'));

  // categorized.soen331 = ScheduleBuilder.categorizeSectionQueueIntoKind(
  // candidateCourses.get('SOEN331'));
  // t.log(categorized.soen331);

  // categorized.soen331 = Util.allCombinations([
  // categorized.soen331.LEC, categorized.soen331.TUT, categorized.soen331.LAB ]);
  // t.log(categorized.soen331);

  categorized.comp348 = ScheduleBuilder.categorizeSectionQueueIntoKind(
    candidateCourses.get('COMP348'),
  );
  t.log(categorized.comp348);

  allCombos.soen348 = Util.allCombinations([
    categorized.comp348.LEC,
    categorized.comp348.TUT,
    categorized.comp348.LAB ]);
  t.log(allCombos.soen348[0]);
});
