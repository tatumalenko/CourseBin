import test from 'ava';

const { Util } = require('./Util');

const { TimeBlock } = require('./../database/models/TimeBlock');

test('allCombinations: Integers - all non-empty arrays', (t) => {
  t.deepEqual(Util.allCombinations([
    [ 1, 2, 3 ],
    [ 4 ],
    [ 5, 6 ],
  ]), [
    [ 1, 4, 5 ],
    [ 1, 4, 6 ],
    [ 2, 4, 5 ],
    [ 2, 4, 6 ],
    [ 3, 4, 5 ],
    [ 3, 4, 6 ] ]);
});

test('allCombinations: Integers - 1 empty array', (t) => {
  t.deepEqual(Util.allCombinations([
    [ 1, 2, 3 ],
    [ 4 ],
    [ ],
  ]), [
    [ 1, 4 ],
    [ 2, 4 ],
    [ 3, 4 ] ]);
});

test('subCombinations: Integers - 3 of 5', (t) => {
  t.deepEqual(Util.subCombinations([ 1, 2, 3, 4, 5 ], 3), [
    [ 1, 2, 3 ],
    [ 1, 2, 4 ],
    [ 1, 2, 5 ],
    [ 1, 3, 4 ],
    [ 1, 3, 5 ],
    [ 1, 4, 5 ],
    [ 2, 3, 4 ],
    [ 2, 3, 5 ],
    [ 2, 4, 5 ],
    [ 3, 4, 5 ],
  ]);
});

test('timesOverlap: Single TimeBlock in array', (t) => {
  const timeArray = [
    new TimeBlock({
      startTime: '17.45.00',
      endTime: '19.30.00',
      weekDay: 'Friday',
    }),
  ];
  t.false(Util.timesOverlap(timeArray));
});

test('timesOverlap: No TimeBlock in array', (t) => {
  const timeArray = [];
  t.false(Util.timesOverlap(timeArray));
});

test('timesOverlap: Overlapping TimeBlock (sorted)', (t) => {
  const timeArray = [
    new TimeBlock({
      startTime: '11.45.00',
      endTime: '13.00.00',
      weekDay: 'Friday',
    }),
    new TimeBlock({
      startTime: '13.00.00',
      endTime: '15.30.00',
      weekDay: 'Friday',
    }),
    new TimeBlock({
      startTime: '17.45.00',
      endTime: '19.30.00',
      weekDay: 'Friday',
    }),
  ];
  t.false(Util.timesOverlap(timeArray));
});

test('timesOverlap: No overlapping TimeBlock (sorted)', (t) => {
  const timeArray = [
    new TimeBlock({
      startTime: '11.45.00',
      endTime: '13.00.00',
      weekDay: 'Friday',
    }),
    new TimeBlock({
      startTime: '13.30.00',
      endTime: '15.30.00',
      weekDay: 'Friday',
    }),
    new TimeBlock({
      startTime: '17.45.00',
      endTime: '19.30.00',
      weekDay: 'Friday',
    }),
  ];
  t.false(Util.timesOverlap(timeArray));
});

test('timesOverlap: Overlapping TimeBlock (unsorted)', (t) => {
  const timeArray = [
    new TimeBlock({
      startTime: '13.00.00',
      endTime: '15.30.00',
      weekDay: 'Friday',
    }),
    new TimeBlock({
      startTime: '11.45.00',
      endTime: '13.05.00',
      weekDay: 'Friday',
    }),
    new TimeBlock({
      startTime: '08.45.00',
      endTime: '10.15.00',
      weekDay: 'Friday',
    }),
  ];
  t.true(Util.timesOverlap(timeArray));
});

test('timesOverlap: No overlapping TimeBlock (unsorted)', (t) => {
  const timeArray = [
    new TimeBlock({
      startTime: '13.30.00',
      endTime: '15.30.00',
      weekDay: 'Friday',
    }),
    new TimeBlock({
      startTime: '11.45.00',
      endTime: '13.00.00',
      weekDay: 'Friday',
    }),
    new TimeBlock({
      startTime: '08.45.00',
      endTime: '10.15.00',
      weekDay: 'Friday',
    }),
  ];
  t.false(Util.timesOverlap(timeArray));
});

test('timesOverlap: Overlapping TimeBlock (Monday)', (t) => {
  const timeArray = [
    new TimeBlock({
      startTime: '13.00.00',
      endTime: '15.30.00',
      weekDay: 'Friday',
    }),
    new TimeBlock({
      startTime: '11.45.00',
      endTime: '12:55.00',
      weekDay: 'Friday',
    }),
    new TimeBlock({
      startTime: '09.45.00',
      endTime: '10.15.00',
      weekDay: 'Monday',
    }),
    new TimeBlock({
      startTime: '08.45.00',
      endTime: '10.05.00',
      weekDay: 'Monday',
    }),
  ];
  t.true(Util.timesOverlap(timeArray));
});

test('timesOverlap: Overlapping TimeBlock (Friday - enclosed)', (t) => {
  const timeArray = [
    new TimeBlock({
      startTime: '18.00.00',
      endTime: '19.30.00',
      weekDay: 'Friday',
    }),
    new TimeBlock({
      startTime: '11.45.00',
      endTime: '13.00.00',
      weekDay: 'Monday',
    }),
    new TimeBlock({
      startTime: '17.45.00',
      endTime: '20.15.00',
      weekDay: 'Friday',
    }),
  ];
  t.true(Util.timesOverlap(timeArray));
});
