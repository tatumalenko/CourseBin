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

  // static unique(objectArray) {
  //   const uniq = [];
  // }
}

module.exports = { Util };
