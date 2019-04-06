const _ = require('lodash');

class Util {
  // Determines if there is a TimeBlock overlap for an array of TimeBlock. The
  // array can contain TimeBlock elements of mixed days of the week, but only
  // those overlap from element of the same week day will be considered when
  // return true.
  static timesOverlap(timeBlocks) {
    // Declare the map to store the arrays for each day of the week.
    const weekDayTimeBlocksMap = {};

    // Place the appropriate TimeBlock elements in their respective map fields.
    timeBlocks.forEach((timeBlock) => {
      if (Object.keys(weekDayTimeBlocksMap).includes(timeBlock.weekDay)) {
        weekDayTimeBlocksMap[timeBlock.weekDay].push(timeBlock);
      } else {
        weekDayTimeBlocksMap[timeBlock.weekDay] = [ timeBlock ];
      }
    });

    // Determines if there is a TimeBlock overlap for an array of TimeBlock all
    // of the same week day.
    const weekDayTimeBlocksOverlap = (weekDayTimeBlocks) => {
      const nBlocks = weekDayTimeBlocks.length;

      if (nBlocks <= 1) {
        return false;
      }

      // Sort array based on start times.
      weekDayTimeBlocks.sort((a, b) => (
      // eslint-disable-next-line no-nested-ternary
        (a.startTime > b.startTime)
          ? 1
          : (
            (b.startTime > a.startTime)
              ? -1
              : 0)));

      // Don't consider equality in comparison to allow online courses with
      // startTime and endTime of '00.00.00' to not indicate overlap between
      // each other.
      for (let i = 0; i < nBlocks - 1; i += 1) {
        if (weekDayTimeBlocks[i + 1].startTime < weekDayTimeBlocks[i].endTime) {
          return true; // Found an overlap
        }
      }

      return false; // No overlap found
    };

    // For each field of the map (i.e. for each week day), if any of the arrays
    // passed for that week day returns true, then return true to the caller.
    return Object.keys(weekDayTimeBlocksMap).some(
      weekDay => weekDayTimeBlocksOverlap(weekDayTimeBlocksMap[weekDay]),
    );
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
