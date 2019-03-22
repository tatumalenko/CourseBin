const test = require('ava');
const mongoose = require('mongoose');

const { ProgramBuilder } = require('./ProgramBuilder');
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
//       requiredCourses: SoftwareEngineeringDegree.requirements.mandatory,
//     },
//   ),
// );

// ProgramBuilder.findCandidateCourses(
//   {
//     completedCourses: student.record.completedCourses.map(e => e.code),
//     requiredCourses: SoftwareEngineeringDegree.requirements.mandatory,
//   },
// ).then(candidateCourses => console.log(candidateCourses));

// ProgramBuilder.findCandidateSectionQueueMap(
//   {
//     completedCourses: student.record.completedCourses.map(e => e.code),
//     requiredCourses: SoftwareEngineeringDegree.requirements.mandatory,
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
//       requiredCourses: SoftwareEngineeringDegree.requirements.mandatory,
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
    requiredCourses: SoftwareEngineeringDegree.requirements.suggested.wsaOption,
    termPreferences: student.termPreferences,
  });

  t.deepEqual(termCourses, [ {
    term: 'fall',
    courses: [ 'SOEN331', 'COMP335', 'COMP346', 'COMP348', 'ENCS282' ],
  }, {
    term: 'winter',
    courses: [ 'SOEN321', 'SOEN341', 'ENGR201', 'ENGR202', 'ENGR213' ],
  }, {
    term: 'summer',
    courses: [ 'SOEN342', 'SOEN384', 'ELEC275', 'ENGR233', 'ENGR301' ],
  }, {
    term: 'fall',
    courses: [ 'SOEN343', 'SOEN357', 'SOEN385', 'ENGR371', 'ENGR391' ],
  }, {
    term: 'winter',
    courses: [ 'SOEN344', 'ENGR392', 'PHYS284', 'ENGR251', 'COMP353' ],
  }, {
    term: 'summer',
    courses: [ 'SOEN390', 'SOEN387', 'COMP445' ],
  }, {
    term: 'fall',
    courses: [ 'SOEN490', 'SOEN487' ],
  } ]);
});

test('Sequence generation 2 courses per term', async (t) => {
  const termCourses = await ProgramBuilder.findCandidateSequences({
    completedCourses: student.record.completedCourses.map(e => e.code),
    requiredCourses: SoftwareEngineeringDegree.requirements.suggested.wsaOption,
    termPreferences: {
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

  termCourses.forEach(e => t.true(e.courses.length <= 2));
});
