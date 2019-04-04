const _ = require('lodash');

const { Util } = require('../../util/Util');

class Schedule {
  constructor({ term, sections }) {
    this.term = term;
    this.sections = sections;
  }

  // Return an object map containing the sections grouped by course code.
  getCourseCodeSectionsMap() {
    return _.groupBy(
      this.sections,
      section => section.courseCode,
    );
  }

  // Return an object map containing the sections grouped by weekday.
  getWeekDaySchedulesMap() {
    const sectionClones = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const section of this.sections) {
      const sectionTimes = section.times;

      // For each TimeBlock element, place the section into the map and replace
      // its times property with only the TimeBlock involved in the iteration.
      // eslint-disable-next-line no-restricted-syntax
      for (const time of sectionTimes) {
        const sectionClone = _.cloneDeep(section);
        sectionClone.times = [ time ];
        sectionClones.push(sectionClone);
      }
    }

    // Return a new object map that groups the keys by weekday of each section's
    // TimeBlock element in times property (only contains one from cloning
    // operations above).
    return _.groupBy(
      sectionClones,
      sectionClone => sectionClone.times[0].weekDay,
    );
  }

  // Return an object map containing the TimeBlock elements of each section
  // grouped by weekday.
  getWeekDayTimeBlocksMap() {
    return _.groupBy(
      _.flatten(
        this.sections.map(section => section.times),
      ), timeBlock => timeBlock.weekDay,
    );
  }

  // Verify if there is any overlapping course section TimeBlock elements for
  // any of day of the week.
  hasConflict() {
    // eslint-disable-next-line
    for (const timeBlocks of Object.values(this.getWeekDayTimeBlocksMap())) {
      // If for any day of the week, the array of times present contains overlapping
      // ranges of TimeBlock objects then return true (there is a conflict)
      if (Util.timesOverlap(timeBlocks)) { return true; }
    }

    return false;
  }

  // Verify if there's an invalid course section kind pairings based on their
  // codes. Tutorials are restricted to the lecture component based on their
  // first or both first and second letters. For example, lecture with code "U"
  // can take tutorials with code "U UA" or "U UC", and lecture code "DD" can
  // take tutorials with code "DDDA" and "DDDC". For single letter lecture codes,
  // the corresponding tutorial codes must start with this letter and a space.
  // For two letter lecture codes, the corresponding tutorials must start with
  // both letters. Labs do not seem to have any restrictions based on lecture
  // codes.
  hasInvalidSectionKindCombination() {
    const courseCodeSectionArrayMap = _.groupBy(this.sections, section => section.courseCode);

    const hasInvalidSectionCodeCombination = (courseSections) => {
      const lec = _.find(courseSections, section => section.kind === 'LEC');
      const tut = _.find(courseSections, section => section.kind === 'TUT');

      if (lec.code.length === 1) {
        if (tut && !tut.code.startsWith(`${lec.code} `)) { // Should contain space
          return true;
        }
      } else if (lec.code.length === 2) {
        if (tut && !tut.code.startsWith(`${lec.code}`)) {
          return true;
        }
      }
      return false;
    };

    return Object.values(courseCodeSectionArrayMap).some(
      sections => hasInvalidSectionCodeCombination(sections),
    );
  }
}

module.exports = { Schedule };
