const test = require('ava');

const { Plan } = require('./Plan');
const { TermPreference } = require('./TermPreference');
const { Schedule } = require('./Schedule');
const { Section } = require('./Section');
const { Location } = require('./Location');
const { TimeBlock } = require('./TimeBlock');

test('sortSchedule 1 - Empty termPreference object', (t) => {
  // TODO: Implement first sortSchedule with empty termPreference passed in
  // Should do nothing to the Schedule array passed in
  t.pass();
});

test('sortSchedule 2 - eveningTimePreference - 2 schedules with 1 section each', (t) => {
  // TODO: Implement first sortSchedule with empty termPreference passed in
  const earlySchedule = new Schedule({
    term: 'FALL',
    schedules: [
      new Schedule({
        term: 'FALL',
        sections: [
          new Section({
            courseCode: 'COMP348',
            code: 'H',
            kind: 'LEC',
            location: new Location({
              code: 'H920',
              building: 'Hall',
              room: '920',
            }),
            mode: 'IN PERSON',
            times: [
              new TimeBlock({
                startTime: '08:45:00',
                endTime: '10:15:00',
                weekDay: 'MONDAY',
              }),
            ],
          }),
        ],
      }),
    ],
  });

  const lateSchedule = new Schedule({
    term: 'FALL',
    schedules: [
      new Schedule({
        term: 'FALL',
        sections: [
          new Section({
            courseCode: 'COMP348',
            code: 'H',
            kind: 'LEC',
            location: new Location({
              code: 'H920',
              building: 'Hall',
              room: '920',
            }),
            mode: 'IN PERSON',
            times: [
              new TimeBlock({
                startTime: '17:45:00',
                endTime: '20:15:00',
                weekDay: 'MONDAY',
              }),
            ],
          }),
        ],
      }),
    ],
  });

  const termPreference = new TermPreference({
    term: 'FALL',
    numberOfCourses: 5,
    requestedCourses: [],
    eveningTimePreference: false,
    timeOfDay: 'MORNING', // Optional (based on eveningTimePreference)
    offDays: [ 'FRIDAY' ],
  });

  t.deepEqual(
    Plan.sortSchedules([ lateSchedule, earlySchedule ], termPreference), // Actual order
    [ earlySchedule, lateSchedule ], // Expected order
  );
});
