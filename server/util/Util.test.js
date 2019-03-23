import test from 'ava';

const { Util } = require('./Util');

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

// const arr = [ [ 1, 2, 3 ], [ 4 ], [ 5, 6 ] ];
// console.log(Util.allCombinations(arr));

// const hashQueueMap = {
//   SOEN331: [ {
//     _id: '5c7416be14d29885ffb38b96',
//     courseCode: 'SOEN331',
//     code: 'U',
//     term: 'FALL',
//     mode: 'In Person',
//     location: [ Object ],
//     kind: 'LEC',
//     times: [ Array ],
//     __v: 0,
//   },
//   {
//     _id: '5c7416be14d29885ffb38b9c',
//     courseCode: 'SOEN331',
//     code: 'U UA',
//     term: 'FALL',
//     mode: 'In Person',
//     location: [ Object ],
//     kind: 'TUT',
//     times: [ Array ],
//     __v: 0,
//   },
//   {
//     _id: '5c7416be14d29885ffb38ba2',
//     courseCode: 'SOEN331',
//     code: 'U UB',
//     term: 'FALL',
//     mode: 'In Person',
//     location: [ Object ],
//     kind: 'TUT',
//     times: [ Array ],
//     __v: 0,
//   },
//   {
//     _id: '5c7416be14d29885ffb38be1',
//     courseCode: 'SOEN331',
//     code: 'W',
//     term: 'FALL',
//     mode: 'In Person',
//     location: [ Object ],
//     kind: 'LEC',
//     times: [ Array ],
//     __v: 0,
//   },
//   {
//     _id: '5c7416be14d29885ffb38be7',
//     courseCode: 'SOEN331',
//     code: 'W WA',
//     term: 'FALL',
//     mode: 'In Person',
//     location: [ Object ],
//     kind: 'TUT',
//     times: [ Array ],
//     __v: 0,
//   },
//   {
//     _id: '5c7416be14d29885ffb38bea',
//     courseCode: 'SOEN331',
//     code: 'W WB',
//     term: 'FALL',
//     mode: 'In Person',
//     location: [ Object ],
//     kind: 'TUT',
//     times: [ Array ],
//     __v: 0,
//   },
//   {
//     _id: '5c7416be14d29885ffb38cb2',
//     courseCode: 'SOEN331',
//     code: 'U UC',
//     term: 'FALL',
//     mode: 'In Person',
//     location: [ Object ],
//     kind: 'TUT',
//     times: [ Array ],
//     __v: 0,
//   },
//   {
//     _id: '5c7416be14d29885ffb38cb8',
//     courseCode: 'SOEN331',
//     code: 'U UD',
//     term: 'FALL',
//     mode: 'In Person',
//     location: [ Object ],
//     kind: 'TUT',
//     times: [ Array ],
//     __v: 0,
//   },
//   {
//     _id: '5c7416be14d29885ffb38cbb',
//     courseCode: 'SOEN331',
//     code: 'U UE',
//     term: 'FALL',
//     mode: 'In Person',
//     location: [ Object ],
//     kind: 'TUT',
//     times: [ Array ],
//     __v: 0,
//   },
//   {
//     _id: '5c7416be14d29885ffb38d37',
//     courseCode: 'SOEN331',
//     code: 'W WC',
//     term: 'FALL',
//     mode: 'In Person',
//     location: [ Object ],
//     kind: 'TUT',
//     times: [ Array ],
//     __v: 0,
//   },
//   {
//     _id: '5c7416be14d29885ffb38d3d',
//     courseCode: 'SOEN331',
//     code: 'W WD',
//     term: 'FALL',
//     mode: 'In Person',
//     location: [ Object ],
//     kind: 'TUT',
//     times: [ Array ],
//     __v: 0,
//   },
//   {
//     _id: '5c7416be14d29885ffb38d43',
//     courseCode: 'SOEN331',
//     code: 'W WE',
//     term: 'FALL',
//     mode: 'In Person',
//     location: [ Object ],
//     kind: 'TUT',
//     times: [ Array ],
//     __v: 0,
//   },
//   {
//     _id: '5c7416be14d29885ffb38d46',
//     courseCode: 'SOEN331',
//     code: 'W WF',
//     term: 'FALL',
//     mode: 'In Person',
//     location: [ Object ],
//     kind: 'TUT',
//     times: [ Array ],
//     __v: 0,
//   },
//   {
//     _id: '5c7416be14d29885ffb38d49',
//     courseCode: 'SOEN331',
//     code: 'W WG',
//     term: 'FALL',
//     mode: 'In Person',
//     location: [ Object ],
//     kind: 'TUT',
//     times: [ Array ],
//     __v: 0,
//   } ],
//   COMP335: [ {
//     _id: '5c7416be14d29885ffb3876b',
//     courseCode: 'COMP335',
//     code: 'N',
//     term: 'FALL',
//     mode: 'In Person',
//     location: [ Object ],
//     kind: 'LEC',
//     times: [ Array ],
//     __v: 0,
//   },
//   {
//     _id: '5c7416be14d29885ffb38775',
//     courseCode: 'COMP335',
//     code: 'N NA',
//     term: 'FALL',
//     mode: 'In Person',
//     location: [ Object ],
//     kind: 'TUT',
//     times: [ Array ],
//     __v: 0,
//   },
//   {
//     _id: '5c7416be14d29885ffb3886f',
//     courseCode: 'COMP335',
//     code: 'N NB',
//     term: 'FALL',
//     mode: 'In Person',
//     location: [ Object ],
//     kind: 'TUT',
//     times: [],
//     __v: 0,
//   } ],
//   COMP346: [ {
//     _id: '5c7416be14d29885ffb3877e',
//     courseCode: 'COMP346',
//     code: 'NI-X',
//     term: 'FALL',
//     mode: 'In Person',
//     location: [ Object ],
//     kind: 'LAB',
//     times: [ Array ],
//     __v: 0,
//   },
//   {
//     _id: '5c7416be14d29885ffb38781',
//     courseCode: 'COMP346',
//     code: 'NJ-X',
//     term: 'FALL',
//     mode: 'In Person',
//     location: [ Object ],
//     kind: 'LAB',
//     times: [ Array ],
//     __v: 0,
//   },
//   {
//     _id: '5c7416be14d29885ffb38795',
//     courseCode: 'COMP346',
//     code: 'NN',
//     term: 'FALL',
//     mode: 'In Person',
//     location: [ Object ],
//     kind: 'LEC',
//     times: [ Array ],
//     __v: 0,
//   },
//   {
//     _id: '5c7416be14d29885ffb3879e',
//     courseCode: 'COMP346',
//     code: 'NNNA',
//     term: 'FALL',
//     mode: 'In Person',
//     location: [ Object ],
//     kind: 'TUT',
//     times: [ Array ],
//     __v: 0,
//   },
//   {
//     _id: '5c7416be14d29885ffb387ac',
//     courseCode: 'COMP346',
//     code: 'NNNB',
//     term: 'FALL',
//     mode: 'In Person',
//     location: [ Object ],
//     kind: 'TUT',
//     times: [ Array ],
//     __v: 0,
//   },
//   {
//     _id: '5c7416be14d29885ffb38809',
//     courseCode: 'COMP346',
//     code: 'WI-X',
//     term: 'FALL',
//     mode: 'In Person',
//     location: [ Object ],
//     kind: 'LAB',
//     times: [ Array ],
//     __v: 0,
//   },
//   {
//     _id: '5c7416be14d29885ffb3880c',
//     courseCode: 'COMP346',
//     code: 'WJ-X',
//     term: 'FALL',
//     mode: 'In Person',
//     location: [ Object ],
//     kind: 'LAB',
//     times: [ Array ],
//     __v: 0,
//   },
//   {
//     _id: '5c7416be14d29885ffb38811',
//     courseCode: 'COMP346',
//     code: 'WW',
//     term: 'FALL',
//     mode: 'In Person',
//     location: [ Object ],
//     kind: 'LEC',
//     times: [ Array ],
//     __v: 0,
//   },
//   {
//     _id: '5c7416be14d29885ffb38814',
//     courseCode: 'COMP346',
//     code: 'WWWA',
//     term: 'FALL',
//     mode: 'In Person',
//     location: [ Object ],
//     kind: 'TUT',
//     times: [ Array ],
//     __v: 0,
//   },
//   {
//     _id: '5c7416be14d29885ffb38817',
//     courseCode: 'COMP346',
//     code: 'WWWB',
//     term: 'FALL',
//     mode: 'In Person',
//     location: [ Object ],
//     kind: 'TUT',
//     times: [ Array ],
//     __v: 0,
//   },
//   {
//     _id: '5c7416be14d29885ffb388de',
//     courseCode: 'COMP346',
//     code: 'YY',
//     term: 'FALL',
//     mode: 'In Person',
//     location: [ Object ],
//     kind: 'LEC',
//     times: [ Array ],
//     __v: 0,
//   },
//   {
//     _id: '5c7416be14d29885ffb389ad',
//     courseCode: 'COMP346',
//     code: 'UU',
//     term: 'FALL',
//     mode: 'In Person',
//     location: [ Object ],
//     kind: 'LEC',
//     times: [ Array ],
//     __v: 0,
//   },
//   {
//     _id: '5c7416be14d29885ffb38aae',
//     courseCode: 'COMP346',
//     code: 'UUUA',
//     term: 'FALL',
//     mode: 'In Person',
//     location: [ Object ],
//     kind: 'TUT',
//     times: [ Array ],
//     __v: 0,
//   },
//   {
//     _id: '5c7416be14d29885ffb38ab1',
//     courseCode: 'COMP346',
//     code: 'UUUB',
//     term: 'FALL',
//     mode: 'In Person',
//     location: [ Object ],
//     kind: 'TUT',
//     times: [ Array ],
//     __v: 0,
//   },
//   {
//     _id: '5c7416be14d29885ffb38ad8',
//     courseCode: 'COMP346',
//     code: 'YYYA',
//     term: 'FALL',
//     mode: 'In Person',
//     location: [ Object ],
//     kind: 'TUT',
//     times: [ Array ],
//     __v: 0,
//   },
//   {
//     _id: '5c7416be14d29885ffb38adb',
//     courseCode: 'COMP346',
//     code: 'YYYB',
//     term: 'FALL',
//     mode: 'In Person',
//     location: [ Object ],
//     kind: 'TUT',
//     times: [ Array ],
//     __v: 0,
//   } ],
//   COMP348: [ {
//     _id: '5c7416be14d29885ffb38767',
//     courseCode: 'COMP348',
//     code: 'E',
//     term: 'FALL',
//     mode: 'In Person',
//     location: [ Object ],
//     kind: 'LEC',
//     times: [ Array ],
//     __v: 0,
//   },
//   {
//     _id: '5c7416be14d29885ffb3896b',
//     courseCode: 'COMP348',
//     code: 'E EI',
//     term: 'FALL',
//     mode: 'In Person',
//     location: [ Object ],
//     kind: 'TUT',
//     times: [ Array ],
//     __v: 0,
//   },
//   {
//     _id: '5c7416be14d29885ffb3896e',
//     courseCode: 'COMP348',
//     code: 'E EJ',
//     term: 'FALL',
//     mode: 'In Person',
//     location: [ Object ],
//     kind: 'TUT',
//     times: [ Array ],
//     __v: 0,
//   },
//   {
//     _id: '5c7416be14d29885ffb38971',
//     courseCode: 'COMP348',
//     code: 'E EK',
//     term: 'FALL',
//     mode: 'In Person',
//     location: [ Object ],
//     kind: 'TUT',
//     times: [ Array ],
//     __v: 0,
//   },
//   ],
// };
