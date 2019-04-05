const test = require('ava');

const { Plan } = require('./Plan');
const { Preferences } = require('./Preferences');
const { TermPreference } = require('./TermPreference');
const { Schedule } = require('./Schedule');
const { Section } = require('./Section');
const { Location } = require('./Location');
const { TimeBlock } = require('./TimeBlock');

test('sortSchedules - Empty preferences object', (t) => {
  const earlySchedule = createScheduleFromSections(
    [
      createSectionFromStartTimes([ '08.45.00' ], 'FALL'),
    ],
  );

  const lateSchedule = createScheduleFromSections(
    [
      createSectionFromStartTimes([ '17.45.00' ], 'FALL'),
    ],
  );

  const plan =
    new Plan({
      sequences: [],
      schedules: {
        fall: [ lateSchedule, earlySchedule ],
        winter: [],
        summer: [],
      },
    });

  t.throws(() => plan.sortSchedules({ preferences: {} }),
    TypeError,
    'Cannot read property \'eveningTimePreference\' of undefined');
});

test('sortSchedules - Empty schedules', (t) => {
  const plan =
    new Plan({
      sequences: [],
      schedules: {
        fall: [],
        winter: [],
        summer: [],
      },
    });

  plan.sortSchedules({
    preferences: createPreferencesFromEveningTimePreferences([ false, false, false ]),
  });

  t.deepEqual(plan, plan, 'Should be true since no schedules to sort');
});

test('sortSchedules - eveningTimePreference - 2 schedules with 1 section each', (t) => {
  const earlySchedule = createScheduleFromSections(
    [
      createSectionFromStartTimes([ '08.45.00' ], 'FALL'),
      createSectionFromStartTimes([ '17.45.00' ], 'FALL'),
    ],
  );

  const lateSchedule = createScheduleFromSections(
    [
      createSectionFromStartTimes([ '17.45.00' ], 'FALL'),
    ],
  );

  // Schedules placed out of order relative to start time.
  const planActual =
    new Plan({
      sequences: [],
      schedules: {
        fall: [ lateSchedule, earlySchedule ],
        winter: [],
        summer: [],
      },
    });

  // Schedules placed in order relative to start time.
  const planExpected =
    new Plan({
      sequences: [],
      schedules: {
        fall: [ earlySchedule, lateSchedule ],
        winter: [],
        summer: [],
      },
    });

  t.notDeepEqual(
    planActual.schedules,
    planExpected.schedules,
    'Should not be equal since different order',
  );

  // Sort the out of order plan schedules.
  planActual.sortSchedules({
    preferences: createPreferencesFromEveningTimePreferences([ false, false, false ]),
  });

  t.deepEqual(
    planActual.schedules,
    planExpected.schedules,
    'Should be equal since now in same order',
  );
});

test('sortSchedules - eveningTimePreference - 3 schedules with 3 section each', (t) => {
  const sections = [
    createSectionFromStartTimes([ '20.05.00' ], 'FALL'),
    createSectionFromStartTimes([ '08.45.00', '08.45.00' ], 'FALL'),
    createSectionFromStartTimes([ '17.45.00', '20:15.00' ], 'FALL'),
    createSectionFromStartTimes([ '10.45.00' ], 'FALL'),
    createSectionFromStartTimes([ '11.45.00', '11.45.00' ], 'FALL'),
    createSectionFromStartTimes([ '14.45.00' ], 'FALL'),
  ];

  const schedules = [
    createScheduleFromSections(sections.slice(0, 3)), // Most late sections
    createScheduleFromSections(sections.slice(3, 5)), // Mix of early and late
    createScheduleFromSections([ sections[1], sections[3], sections[4] ]), // Most early sections
  ];

  // Schedules placed out of order relative to start time.
  const planActual =
    new Plan({
      sequences: [],
      schedules: {
        fall: schedules,
        winter: [],
        summer: [],
      },
    });

  // Schedules placed in order relative to start time.
  const planExpected =
    new Plan({
      sequences: [],
      schedules: {
        fall: [ schedules[2], schedules[1], schedules[0] ],
        winter: [],
        summer: [],
      },
    });

  t.notDeepEqual(
    planActual.schedules,
    planExpected.schedules,
    'Should not be equal since different order',
  );

  // Sort the out of order plan schedules.
  planActual.sortSchedules({
    preferences: createPreferencesFromEveningTimePreferences([ false, false, false ]),
  });

  t.deepEqual(
    planActual.schedules,
    planExpected.schedules,
    'Should be equal since now in same order',
  );
});

function createPreferencesFromEveningTimePreferences(eveningTimePreferences) {
  return new Preferences({
    fall: new TermPreference({
      term: 'FALL',
      numberOfCourses: 5,
      requestedCourses: [],
      eveningTimePreference: eveningTimePreferences[0],
      timeOfDay: 'MORNING', // Optional (based on eveningTimePreference)
      offDays: [ 'FRIDAY' ],
    }),
    winter: new TermPreference({
      term: 'WINTER',
      numberOfCourses: 5,
      requestedCourses: [],
      eveningTimePreference: eveningTimePreferences[1],
      timeOfDay: 'MORNING', // Optional (based on eveningTimePreference)
      offDays: [ 'FRIDAY' ],
    }),
    summer: new TermPreference({
      term: 'SUMMER',
      numberOfCourses: 5,
      requestedCourses: [],
      eveningTimePreference: eveningTimePreferences[2],
      timeOfDay: 'MORNING', // Optional (based on eveningTimePreference)
      offDays: [ 'FRIDAY' ],
    }),
  });
}

function createSectionFromStartTimes(startTimes, term = 'FALL') {
  const times = startTimes.length > 1 ?
    [
      new TimeBlock({
        startTime: startTimes[0],
        endTime: '10.15.00',
        weekDay: 'MONDAY',
      }),
      new TimeBlock({
        startTime: startTimes[1],
        endTime: '10.15.00',
        weekDay: 'MONDAY',
      }),
    ] :
    [
      new TimeBlock({
        startTime: startTimes[0],
        endTime: '10.15.00',
        weekDay: 'MONDAY',
      }),
    ];

  return new Section({
    courseCode: 'COMP348',
    code: 'H',
    kind: 'LEC',
    location: new Location({
      code: 'H920',
      building: 'Hall',
      room: '920',
    }),
    mode: 'IN PERSON',
    times,
    dates: [
      '01/05/2019',
      '04/12/2019',
    ],
    term,
  });
}

function createScheduleFromSections(sections) {
  return new Schedule({
    term: sections[0].term,
    sections,
  });
}
