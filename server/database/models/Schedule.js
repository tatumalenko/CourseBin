const { Util } = require('../../util/Util');

class Schedule {
  constructor({ term, sections }) {
    this.term = term;
    this.sections = sections;
  }

  hasConflict() {
    const sectionTimeBlocks = this.sections.map(section => section.times);
    const weekDayTimeBlockMap = {
      MONDAY: [],
      TUESDAY: [],
      WEDNESDAY: [],
      THURSDAY: [],
      FRIDAY: [],
    };

    sectionTimeBlocks.forEach((e) => {
      weekDayTimeBlockMap[e.weekDay].push(e);
    });

    // eslint-disable-next-line
    for (const weekDay in weekDayTimeBlockMap) {
      // If for any day of the week, the array of times present contains overlapping
      // ranges of TimeBlock objects then return true (there is a conflict)
      if (Util.timesOverlap(weekDayTimeBlockMap[weekDay])) { return true; }
    }

    return false;
  }
}

module.exports = { Schedule };
