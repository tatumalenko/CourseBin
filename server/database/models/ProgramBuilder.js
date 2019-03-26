/* eslint max-len: 0 */
const _ = require('lodash');

const { Section } = require('./Section');
const { Catalog } = require('./Catalog');
const { Timetable } = require('./Timetable');
const { Schedule } = require('./Schedule');
const { Sequence } = require('./Sequence');
const { Plan } = require('./Plan');
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

    const hasNoUnmetDependencies =
      this.hasNoUnmetDependenciesPartial({ completedCourses });

    const isCandidateCourses = await Promise.all(
      uncompletedCourses.map(
        uncompletedCourse => hasNoUnmetDependencies(uncompletedCourse),
      ),
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
      mapQueue.set(sections[0].courseCode, sections.map(section => new Section(section)));
    });

    return mapQueue;
  }

  static async findCandidateSectionQueueMap({ completedCourses, requiredCourses, term }) {
    const candidateCourses =
      await this.findCandidateCourses({ completedCourses, requiredCourses });
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

  static findCoursesFromSections(sections) {
    const courses = [];

    sections.forEach((section) => {
      if (!courses.includes(section.courseCode)) {
        courses.push(section.courseCode);
      }
    });

    return courses;
  }

  static async findCandidateTermSchedules({
    completedCourses,
    requiredCourses,
    termPreference,
  }) {
    const sectionQueueMap = await this.findCandidateSectionQueueMap({
      completedCourses,
      requiredCourses,
      term: termPreference.term,
    });

    // Convert map to primitive object because I can't deal with remembering what
    // is a primitive object and what is a Map object
    const courseCodeSectionArrayMap = Util.objectFromMap(sectionQueueMap);

    // Only keep the keys of the map that correspond to the courses specicied
    // in requestedCourses
    const requestedCouseCodeSectionArrayMap = {};
    Object.keys(courseCodeSectionArrayMap)
      .filter(key => termPreference.requestedCourses.includes(key))
      .forEach((key) => {
        requestedCouseCodeSectionArrayMap[key] = courseCodeSectionArrayMap[key];
      });

    // For each key in object (course code), categorize the array of sections
    // into subobject of categorized LEC/TUT/LAB components
    const categorizedCourseCodeSectionArrayMap = {};
    Object.keys(requestedCouseCodeSectionArrayMap)
      .forEach((key) => {
        categorizedCourseCodeSectionArrayMap[key] =
          this.categorizeSectionQueueIntoKind(requestedCouseCodeSectionArrayMap[key]);
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

    // Find all the combinations of each subSectionCombination of kCn sets
    // This will become a triple nested object (array of combos, where each
    // combo is a jagged array)
    const sectionCombinations = Util.allCombinations(sectionCombinationJaggedArray);

    // Create a schedule object for each combination
    const schedules = sectionCombinations.map(e => new Schedule({
      term: termPreference.term,
      sections: _.flatten(e), // They were nested by courseCode
    }));

    // Filter all schedules by whether they present a conflict. Note here we're
    // using splice instead of filter because this array can be huge and copying
    // the contents over again can become costly in terms of memory and time.
    schedules.forEach((e, i) => {
      if (e.hasConflict()) {
        schedules.splice(i, 1); // Remove this element only
      }
    });

    return schedules;
  }

  static async findCandidateSchedules({
    completedCourses,
    requiredCourses,
    preferences,
  }) {
    let updatedCompletedCourses = completedCourses;

    const fallSchedules = this.findCandidateTermSchedules({
      completedCourses: updatedCompletedCourses,
      requiredCourses,
      termPreference: preferences.fall,
    });

    // Extract the courses from the schedules by using the first element
    const fallCourses = fallSchedules[0] ?
      this.findCoursesFromSections(fallSchedules[0].sections) : [];

    // Include the courses to be taken in fall
    updatedCompletedCourses = [ ...updatedCompletedCourses, ...fallCourses ];

    const winterSchedules = this.findCandidateTermSchedules({
      completedCourses: updatedCompletedCourses,
      requiredCourses,
      termPreference: preferences.winter,
    });

    // Extract the courses from the schedules by using the first element
    const winterCourses = winterSchedules[0] ?
      this.findCoursesFromSections(winterSchedules[0].sections) : [];

    // Include the courses to be taken in winter
    updatedCompletedCourses = [ ...updatedCompletedCourses, ...winterCourses ];

    const summerSchedules = this.findCandidateTermSchedules({
      completedCourses: updatedCompletedCourses,
      requiredCourses,
      termPreference: preferences.summer,
    });

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
    let candidateCourses = await this.findCandidateCourses({
      completedCourses: completed,
      requiredCourses: required,
    });
    while (_.difference(required, completed).length > 0) {
      if (Preferences[terms[termTracker % numberOfTerms]].numberOfCourses !== 0) {
        // Of the candidate courses, pick at most the number specified in
        // termPreferences, and add those to the lot of completedCOurses
        const sequence = new Sequence({
          term: terms[termTracker % numberOfTerms],
          courses: candidateCourses.slice(0,
            Preferences[terms[termTracker % numberOfTerms]].numberOfCourses),
        });
        termCourses.push(sequence);
        completed = _.uniq([ ...completed, ..._.flatten(sequence.sections) ]);
        // eslint-disable-next-line
        candidateCourses = await this.findCandidateCourses({ 
          completedCourses: completed,
          requiredCourses: required,
        });
      }
      termTracker += 1;
    }

    return termCourses;
  }

  static async findCandidatePlan({
    completedCourses,
    requiredCourses,
    preferences,
  }) {
    const candidateSchedules = this.findCandidateSchedules({
      completedCourses,
      requiredCourses,
      preferences,
    });

    // Given the TermPreference in preferences for each term, sort the schedules
    // array such that the Schedule elements with a 'higher priority' appears as
    // the front of the array in a priority queue like fashion. Note the sorting
    // here is done in place for the same reason as when we used splice inside
    // findCandidateTermSchedules(...).
    Plan.sortSchedules({ schedules: candidateSchedules.fall, termPreference: preferences.fall });
    Plan.sortSchedules({ schedules: candidateSchedules.winter, termPreference: preferences.winter });
    Plan.sortSchedules({ schedules: candidateSchedules.summer, termPreference: preferences.summer });

    // Add all courses includes in the schedules obtained since they will need to
    // be assumed to be completed when assessing the sequences for subsequent terms
    const updatedCompletedCourses = [
      ...completedCourses,
      ...this.findCoursesFromSections(candidateSchedules.fall[0] ?
        candidateSchedules.fall[0].sections : []),
      ...this.findCoursesFromSections(candidateSchedules.winter[0] ?
        candidateSchedules.winter[0].sections : []),
      ...this.findCoursesFromSections(candidateSchedules.summer[0] ?
        candidateSchedules.summer[0].sections : []),
    ];

    // The completedCourses would need to be updated with those included in schedules
    const candidateSequences = this.findCandidateSequences({
      updatedCompletedCourses,
      requiredCourses,
      preferences,
    });

    return new Plan({
      schedules: candidateSchedules,
      sequences: candidateSequences,
    });
  }
}

module.exports = { ProgramBuilder };
