/* eslint max-len: 0 */
const _ = require('lodash');

const { Catalog } = require('./Catalog');
const { Timetable } = require('./Timetable');
const { Schedule } = require('./Schedule');
const { Sequence } = require('./Sequence');
const { Util } = require('./../../util/Util');

class ProgramBuilder {
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

  static async findCandidateTermSchedules({ completedCourses, requiredCourses, termPreference }) {
    // TODO: trying to find all possible combinations of non-specified courses
    // (i.e. of all candidates courses) might be too many possibilities and might
    // not only make the options too numerous too display but severely hamper the
    // speed. To this end, perhaps the best way to proceed is to force the user
    // to select all courses they wish to register for each term and us not try
    // to propose a million options.
    const sectionQueueMap = this.findCandidateSectionQueueMap({
      completedCourses,
      requiredCourses,
      term: termPreference.term,
    });

    // Convert map to primitive object because I can't deal with remembering what
    // is an primitive object and what is a Map object
    const courseCodeSectionArrayMap = Util.objectFromMap(sectionQueueMap);

    // For each key in object (course code), categorize the array of sections
    // into subobject of categorized LEC/TUT/LAB components
    const categorizedCourseCodeSectionArrayMap = {};
    Object.keys(courseCodeSectionArrayMap)
      .forEach((key) => {
        categorizedCourseCodeSectionArrayMap[key] = this.categorizeSectionQueueIntoKind(courseCodeSectionArrayMap[key]);
      });

    // For each key in object (course code), store the set of all combinations
    // for the section's components
    const courseCodeSectionCombinationArrayMap = {};
    Object.keys(categorizedCourseCodeSectionArrayMap)
      .forEach((key) => {
        courseCodeSectionCombinationArrayMap[key] = Util.allCombinations([
          categorizedCourseCodeSectionArrayMap[key].LEC,
          categorizedCourseCodeSectionArrayMap[key].TUT,
          categorizedCourseCodeSectionArrayMap[key].LAB,
        ]);
      });

    // Convert map into an array of arrays, where each array is the combinations
    // determined in courseCodeSectionCombinationArrayMap
    const sectionCombinationJaggedArray =
      Object.keys(courseCodeSectionCombinationArrayMap)
        .map(key => courseCodeSectionCombinationArrayMap[key]);

    // Find the kCn sets first so that we don't try to find all combinations
    // of like 10 sections
    const sectionSubCombinations = Util.subCombinations(
      sectionCombinationJaggedArray,
      termPreference.numberOfCourses,
    );

    // Find all the combinations of each subSectionCombination of kCn sets
    // This will become a triple nested object (array of combos, where each
    // combo is a jagged array)
    const sectionCombinations = sectionSubCombinations.map(e => Util.allCombinations(e));

    // Flatten the results from sectionCombinations because we only care about
    // all the kCn sets of combinations, we don't care about which combinations
    // come from which subset of sets?! This is really confusing...
    const flatSectionCombinations = _.flatten(sectionCombinations);

    // Find all possible combinations of up to termPreference.numberOfCourses section
    // groups (LEC+TUT+LAB) of those hopefully including the ones the student
    // requested (pick out of those)

    // Start by filtering the sectionQueueMap entries by those student requested
    // const filteredSectionQueueMap =
    //   Object.keys(sectionQueueMap)
    //     .filter(
    //       key => termPreference.requiredCourses.includes(sectionQueueMap[key]),
    //     )
    //     .map(key => sectionQueueMap[key]);

    // if (Object.keys(filteredSectionQueueMap).length < termPreference.numberOfCourses) {
    //   const leftoverSectionQueueMapKeys = _.difference(
    //     Object.keys(sectionQueueMap),
    //     Object.keys(filteredSectionQueueMap),
    //   );

    //   const leftoverSectionQueueMap = leftoverSectionQueueMapKeys.map(key => sectionQueueMap[key]);

    //   const leftoverCoursesToAdd = Object.keys(filteredSectionQueueMap).length - termPreference.numberOfCourses;

    //   // Add the other section queues to the filtered map
    //   // TODO: Should filter further among these by offDays & timeOfDay preference
    //   filteredSectionQueueMap.push(...leftoverSectionQueueMap.slice(0, leftoverCoursesToAdd));
    // }

    const schedule = new Schedule({ term: termPreference.term, sections: flatSectionCombinations });

    return schedule;
  }

  static async findCandidateSchedules({ completedCourses, requiredCourses, preferences }) {
    const fallSchedules = this.findCandidateTermSchedules({ completedCourses, requiredCourses, termPreference: preferences.fall });
    const winterSchedules = this.findCandidateTermSchedules({ completedCourses, requiredCourses, termPreference: preferences.winter });
    const summerSchedules = this.findCandidateTermSchedules({ completedCourses, requiredCourses, termPreference: preferences.summer });

    return {
      fall: fallSchedules,
      winter: winterSchedules,
      summer: summerSchedules,
    };
  }

  static async findCandidateSequences({
    completedCourses,
    requiredCourses,
    Preferences,
  }) {
    let completed = completedCourses;
    const required = requiredCourses;
    const termCourses = [];
    const terms = [ 'fall', 'winter', 'summer' ];
    const numberOfTerms = terms.length;

    let termTracker = 0;
    // Get all candidate courses given currently completed courses
    let candidateCourses = await this.findCandidateCourses({ completedCourses: completed, requiredCourses: required });
    while (_.difference(required, completed).length > 0) {
      if (Preferences[terms[termTracker % numberOfTerms]].numberOfCourses !== 0) {
        // Of the candidate courses, pick at most the number specified in termPreferences, and add those to the lot of completedCOurses
        const sequence = new Sequence({
          term: terms[termTracker % numberOfTerms],
          courses: candidateCourses.slice(0, Preferences[terms[termTracker % numberOfTerms]].numberOfCourses),
        });
        termCourses.push(sequence);
        completed = _.uniq([ ...completed, ..._.flatten(sequence.sections) ]);
        // eslint-disable-next-line
        candidateCourses = await this.findCandidateCourses({ completedCourses: completed, requiredCourses: required });
      }
      termTracker += 1;
    }

    return termCourses;
  }

  static async getCandidatePlans({
    completedCourses,
    requiredCourses,
    preferences,
  }) {
    const candidatesSchedules = this.findCandidateSchedules({ completedCourses, requiredCourses, preferences });
    // The completedCourses would need to be updated with those included in schedules
    const candidateSequences = this.findCandidateSequences({ completedCourses, requiredCourses, preferences });
  }
}

module.exports = { ProgramBuilder };
