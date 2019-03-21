/* eslint max-len: 0 */
const _ = require('lodash');

const { Catalog } = require('./Catalog');
const { Timetable } = require('./Timetable');
// const { Util } = require('./../../util/Util');

class ScheduleBuilder {
  static findUncompletedCourses({ requiredCourses, completedCourses }) {
    return _.difference(requiredCourses, completedCourses);
  }

  static hasNoUnmetDependenciesPartial({ completedCourses }) {
    return async (uncompletedCourse) => {
      let allDependenciesMet;
      try {
        const course = await Catalog.findOne({ code: uncompletedCourse });
        // Verify if all prerequisites are met
        allDependenciesMet = course.prerequisiteCodes ? course.prerequisiteCodes.every(
          prerequisiteOrCodes => prerequisiteOrCodes.some(
            prerequisiteCode => completedCourses.includes(prerequisiteCode),
          ),
        ) : true;

        // If the prerequisites are not satisfied, don't bother checking corequisites
        if (allDependenciesMet) {
          // Verify if all corequisites are met
          allDependenciesMet = course.corequisiteCodes ? course.corequisiteCodes.every(
            corequisiteOrCodes => corequisiteOrCodes.some(
              corequisiteCode => completedCourses.includes(corequisiteCode),
            ),
          ) : true;
        }
      } catch (err) {
        console.error(
          `Error caught for hasUnmetDependencies with uncompletedCourse: ${uncompletedCourse}`,
        );
        console.error(err);
      }
      return allDependenciesMet;
    };
  }

  // Checks for unmet dependencies
  static async findCandidateCourses({ completedCourses, requiredCourses }) {
    const uncompletedCourses = this.findUncompletedCourses({
      requiredCourses,
      completedCourses,
    });

    const hasNoUnmetDependencies = this.hasNoUnmetDependenciesPartial({ completedCourses });

    const isCandidateCourses = await Promise.all(
      uncompletedCourses.map(uncompletedCourse => hasNoUnmetDependencies(uncompletedCourse)),
    );

    return uncompletedCourses.filter((e, i) => isCandidateCourses[i]);
  }

  static async getMapQueueSections({ candidateCourses, term }) {
    const mapQueue = new Map();

    let candidateSections = await Promise.all(
      candidateCourses.map(
        candidateCourse => Timetable.find({ courseCode: candidateCourse, term }),
      ),
    );

    // Filter nested arrays of zero length (i.e. no sections found for a given courseCode)
    candidateSections = candidateSections.filter(sections => sections.length > 0);

    candidateSections.forEach((sections) => {
      mapQueue.set(sections[0].courseCode, sections);
    });

    return mapQueue;
  }

  static async findCandidateSectionQueueMap({ completedCourses, requiredCourses, term }) {
    const candidateCourses = await this.findCandidateCourses({ completedCourses, requiredCourses });
    return this.getMapQueueSections({ candidateCourses, term });
  }

  static categorizeSectionQueueIntoKind(sectionQueue) {
    const categorizedSectionQueue = {
      LEC: [],
      TUT: [],
      LAB: [],
    };

    sectionQueue.forEach((e) => {
      categorizedSectionQueue[e.kind].push(e);
    });

    return categorizedSectionQueue;
  }

  static async findCandidateSchedules({ completedCourses, requiredCourses, term }) {
    return this.findCandidateSectionQueueMap({ completedCourses, requiredCourses, term });
  }

  static async findCandidateSequences({ completedCourses, requiredCourses, termPreferences }) {
    let completed = completedCourses;
    const required = requiredCourses;
    const termCourses = [];
    const terms = [ 'fall', 'winter', 'summer' ];
    const numberOfTerms = terms.length;

    let termTracker = 0;
    // Get all candidate courses given currently completed courses
    let candidateCourses = await this.findCandidateCourses({ completedCourses: completed, requiredCourses: required });
    while (_.difference(required, completed).length > 0) {
      if (termPreferences[terms[termTracker % numberOfTerms]].numberOfCourses !== 0) {
        // Of the candidate courses, pick at most 5, and add those to the lot of completedCOurses
        const thisTerm = {
          term: terms[termTracker % numberOfTerms],
          courses: candidateCourses.slice(0, termPreferences[terms[termTracker % numberOfTerms]].numberOfCourses),
        };
        termCourses.push(thisTerm);
        completed = _.uniq([ ...completed, ..._.flatten(thisTerm.courses) ]);
        // eslint-disable-next-line
        candidateCourses = await this.findCandidateCourses({ completedCourses: completed, requiredCourses: required });
      }
      termTracker += 1;
    }

    return termCourses;
  }

  static async getCandidateSchedulesAndSequences({
    completedCourses,
    requiredCourses,
    termPreferences,
  }) {
    const candidatesSchedules = this.findCandidateSchedules({ completedCourses, requiredCourses });
    // The completedCourses would need to be updated with those included in schedules
    const candidateSequences = this.findCandidateSequences({ completedCourses, requiredCourses });
  }
}

module.exports = { ScheduleBuilder };

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

// console.log(ScheduleBuilder.categorizeSectionQueueIntoKind(hashQueueMap.SOEN331));
