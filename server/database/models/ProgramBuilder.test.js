const test = require('ava');
const mongoose = require('mongoose');

const { ProgramBuilder } = require('./ProgramBuilder');
const { SoftwareEngineeringDegree } = require('./SoftwareEngineeringDegree');
const { Util } = require('../../util/Util');
const { Sequence } = require('./Sequence');
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
      { code: 'ENCS272', grade: 'A' },
      { code: 'PHYS205', grade: 'A' },
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
  termPreferences: {
    fall: {
      numberOfCourses: 5,
    },
    winter: {
      numberOfCourses: 5,
    },
    summer: {
      numberOfCourses: 5,
    },
  },
};

// console.log(
//   ProgramBuilder.findUncompletedCourses(
//     {
//       completedCourses: student.record.completedCourses.map(e => e.code),
//       requiredCourses: SoftwareEngineeringDegree.requirements().mandatory,
//     },
//   ),
// );

// ProgramBuilder.findCandidateCourses(
//   {
//     completedCourses: student.record.completedCourses.map(e => e.code),
//     requiredCourses: SoftwareEngineeringDegree.requirements().mandatory,
//   },
// ).then(candidateCourses => console.log(candidateCourses));

// ProgramBuilder.findCandidateSectionQueueMap(
//   {
//     completedCourses: student.record.completedCourses.map(e => e.code),
//     requiredCourses: SoftwareEngineeringDegree.requirements().mandatory,
//     term: 'FALL',
//   },
// ).then((candidateCourses) => {
//   console.log(candidateCourses);
//   const soen331 = ProgramBuilder.categorizeSectionQueueIntoKind(
//     candidateCourses.get('SOEN331'),
//   );
//   console.log(soen331);
// });

// test('Find candidate section queue map', async (t) => {
//   const candidateSectionQueueMap = await ProgramBuilder.findCandidateSectionQueueMap(
//     {
//       completedCourses: student.record.completedCourses.map(e => e.code),
//       requiredCourses: SoftwareEngineeringDegree.requirements().mandatory,
//       term: 'FALL',
//     },
//   );

//   t.log(candidateSectionQueueMap);
//   const soen331 = ProgramBuilder.categorizeSectionQueueIntoKind(
//     candidateSectionQueueMap.get('SOEN331'),
//   );
//   console.log(soen331);
// });

const hashQueueMap = new Map(Object.entries(
  {
    COMP348: [ {
      courseCode: 'COMP348',
      code: 'E',
      kind: 'LEC',
    },
    {
      courseCode: 'COMP348',
      code: 'E EI',
      kind: 'TUT',
    },
    {
      courseCode: 'COMP348',
      code: 'E EJ',
      kind: 'TUT',
    },
    {
      courseCode: 'COMP348',
      code: 'E EK',
      kind: 'TUT',
    },
    ],
  },
));

// Invoke test with name of test with arrow function and
test('Categorizing COMP348', (t) => {
  t.deepEqual(ProgramBuilder.categorizeSectionQueueIntoKind(
    hashQueueMap.get('COMP348'),
  ), {
    LAB: [],
    LEC: [
      {
        code: 'E',
        courseCode: 'COMP348',
        kind: 'LEC',
      },
    ],
    TUT: [
      {
        code: 'E EI',
        courseCode: 'COMP348',
        kind: 'TUT',
      },
      {
        code: 'E EJ',
        courseCode: 'COMP348',
        kind: 'TUT',
      },
      {
        code: 'E EK',
        courseCode: 'COMP348',
        kind: 'TUT',
      },
    ],
  });
});

test('Combinations COMP348', (t) => {
  const categorized = {};
  categorized.comp348 = ProgramBuilder.categorizeSectionQueueIntoKind(
    hashQueueMap.get('COMP348'),
  );

  t.deepEqual(Util.allCombinations([
    categorized.comp348.LEC,
    categorized.comp348.TUT,
    categorized.comp348.LAB ]), [ [
    {
      code: 'E',
      courseCode: 'COMP348',
      kind: 'LEC',
    },
    {
      code: 'E EI',
      courseCode: 'COMP348',
      kind: 'TUT',
    },
  ],
  [
    {
      code: 'E',
      courseCode: 'COMP348',
      kind: 'LEC',
    },
    {
      code: 'E EJ',
      courseCode: 'COMP348',
      kind: 'TUT',
    },
  ],
  [
    {
      code: 'E',
      courseCode: 'COMP348',
      kind: 'LEC',
    },
    {
      code: 'E EK',
      courseCode: 'COMP348',
      kind: 'TUT',
    },
  ] ]);
});

test('Sequence generation 5 courses per term', async (t) => {
  const termCourses = await ProgramBuilder.findCandidateSequences({
    completedCourses: student.record.completedCourses.map(e => e.code),
    requiredCourses: SoftwareEngineeringDegree.requirements().suggested.wsaOption,
    preferences: student.termPreferences,
  });
  const coursesTest = [ await new Sequence({
    term: 'fall',
    year: 2019,
    courses: [ 'SOEN331', 'COMP335', 'COMP346', 'COMP348', 'ENCS282' ],
  }), await new Sequence({
    term: 'winter',
    year: 2020,
    courses: [ 'SOEN321', 'SOEN341', 'ENGR201', 'ENGR202', 'ENGR213' ],
  }), await new Sequence({
    term: 'summer',
    year: 2020,
    courses: [ 'SOEN342', 'SOEN384', 'ELEC275', 'ENGR233', 'ENGR301' ],
  }), await new Sequence({
    term: 'fall',
    year: 2020,
    courses: [ 'SOEN343', 'SOEN357', 'SOEN385', 'ENGR371', 'ENGR391' ],
  }), await new Sequence({
    term: 'winter',
    year: 2021,
    courses: [ 'SOEN344', 'ENGR392', 'PHYS284', 'ENGR251', 'COMP353' ],
  }), await new Sequence({
    term: 'summer',
    year: 2021,
    courses: [ 'SOEN390', 'SOEN387', 'COMP445' ],
  }), await new Sequence({
    term: 'fall',
    year: 2021,
    courses: [ 'SOEN490', 'SOEN487' ],
  }) ];
  t.deepEqual(termCourses, coursesTest);
});

test('Sequence generation 2 courses per term', async (t) => {
  const sequences = await ProgramBuilder.findCandidateSequences({
    completedCourses: student.record.completedCourses.map(e => e.code),
    requiredCourses: SoftwareEngineeringDegree.requirements().suggested.wsaOption,
    preferences: {
      fall: {
        numberOfCourses: 2,
      },
      winter: {
        numberOfCourses: 2,
      },
      summer: {
        numberOfCourses: 2,
      },
    },
  });

  sequences.forEach(sequence => t.true(sequence.courses.length <= 2));
});

test('Schedule generation 5 courses per term', async (t) => {
  // TODO: Needs work, need to finish implementing Util.timesOverlap first
  // const termSchedulesActual = await ProgramBuilder.findCandidateTermSchedules({
  //   completedCourses: student.record.completedCourses.map(e => e.code),
  //   requiredCourses: SoftwareEngineeringDegree.requirements().suggested.wsaOption,
  //   termPreference: {
  //     term: 'FALL',
  //     numberOfCourses: 5,
  //     requestedCourses: [ 'SOEN331', 'COMP335', 'COMP346', 'COMP348', 'ENCS282' ],
  //   },
  // });

  // const termSchedulesExpected = [
  //   [
  //     {
  //       courseCode: 'SOEN331',
  //       code: 'H',
  //     },
  //     {
  //       courseCode: 'COMP335',
  //       code: 'H',
  //     },
  //   ],
  // ];

  // t.deepEqual(termSchedulesActual, termSchedulesExpected);
  t.fail('Not yet implemented');
});
