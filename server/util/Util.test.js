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
