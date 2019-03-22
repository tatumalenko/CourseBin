const _ = require('lodash');

class Util {
  static setDifference({
    superSet,
    subSet,
  }) {
    const differenceSet = new Set(superSet);
    subSet.forEach((setElement) => {
      differenceSet.delete(setElement);
    });
    return differenceSet;
  }

  static arrayDifference({
    superArray,
    subArray,
  }) {
    return Array.from(this.setDifference(
      {
        superSet: new Set(superArray),
        subSet: new Set(subArray),
      },
    ));
  }

  static allCombinations(jaggedArrayOfObjects) {
    // Filter out empty arrays to not consider them in combinations
    const copy = _.filter(jaggedArrayOfObjects, _.size);

    const n = copy.length;

    const indices = [];

    for (let i = 0; i < n; i += 1) { indices[i] = 0; }

    const combos = [];
    let combo = [];

    // eslint-disable-next-line
    while (true) {
      combo = [];

      for (let i = 0; i < n; i += 1) {
        combo.push(copy[i][indices[i]]);
      }

      combos.push(combo);

      let next = n - 1;
      while (next >= 0 && (indices[next] + 1 >= copy[next].length)) {
        next -= 1;
      }

      if (next < 0) {
        return combos;
      }

      indices[next] += 1;

      for (let i = next + 1; i < n; i += 1) {
        indices[i] = 0;
      }
    }
  }
}

module.exports = { Util };

// assert(_.isEqual(Util.allCombinations([
//   [ 1, 2, 3 ],
//   [ 4 ],
//   [ 5, 6 ],
// ]), [
//   [ 1, 4, 5 ],
//   [ 1, 4, 6 ],
//   [ 2, 4, 5 ],
//   [ 2, 4, 6 ],
//   [ 3, 4, 5 ],
//   [ 3, 4, 6 ] ]));

// assert(_.isEqual(Util.allCombinations([
//   [ 1, 2, 3 ],
//   [ 4 ],
//   [ ],
// ]), [
//   [ 1, 4 ],
//   [ 2, 4 ],
//   [ 3, 4 ] ]));
