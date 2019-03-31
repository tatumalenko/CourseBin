const _ = require('lodash');

class Util {
  static timesOverlap(timeBlocks) {
    const blockArray = timeBlocks;
    const length = timeBlocks.length;
    // Sort array based on start times.
    blockArray.sort((a, b) => ((a.startTime > b.startTime) ? 1 : ((b.startTime > a.startTime) ? -1 : 0)));

    for (let i = 0; i < length - 1; i += 1) {
      if (blockArray[i + 1].startTime <= blockArray[i].endTime) { return true; }
    }
    return false;
  }

  static objectFromMap(map) {
    return Array.from(map).reduce((obj, [ key, value ]) => (
      Object.assign(obj, { [key]: value }) // Be careful! Maps can have non-String keys; object literals can't.
    ), {});
  }

  static subCombinations(arrayOfObjects, k) {
    const n = arrayOfObjects.length;

    const combos = [];

    const combinations = (arr, data, start, end, index, r) => {
      if (index === r) {
        const combo = [];
        for (let j = 0; j < r; j += 1) {
          combo.push(data[j]);
        }
        combos.push(combo);
        return;
      }

      for (let i = start; i <= end && end - i + 1 >= r - index; i += 1) {
        // eslint-disable-next-line
        data[index] = arr[i];
        combinations(arr, data, i + 1, end, index + 1, r);
      }
    };

    combinations(arrayOfObjects, [], 0, n - 1, 0, k);

    return combos;
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
