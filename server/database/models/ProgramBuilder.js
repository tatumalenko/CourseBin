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
    return _.difference(requiredCourses.map(e => (e.code ? e.code : e)), completedCourses.map(e => (e.code ? e.code : e)));
  }

  static hasNoUnmetDependenciesPartial({ completedCourses }) {
    if (completedCourses.some(e => !e)) {
      console.error('hasNoUnmetDependenciesPartial: falsy value detected inside completedCourses.');
    }
    return (uncompletedCourse, missingDependencies) => {
      let allDependenciesMet;
      try {
        let course;
        if (_.isString(uncompletedCourse)) {
          course = Catalog.findOne({ code: uncompletedCourse });
        } else if (uncompletedCourse.code) {
          course = Catalog.findOne({ code: uncompletedCourse.code });
        }
        // Verify if all prerequisites are met
        // Check if completedCourses is an array of {} or ''
        allDependenciesMet = course.prerequisiteCodes ? course.prerequisiteCodes.every(
          prerequisiteOrCodes => prerequisiteOrCodes.some(
            (prerequisiteCode) => {
              // Supplied courses are simply strings of the course codes
              if (completedCourses[0] && _.isString(completedCourses[0])) {
                return completedCourses.includes(prerequisiteCode);
              }
              // Supplied courses are actually objects with code and grade props
              return completedCourses.map(e => (e.code ? e.code : e)).includes(prerequisiteCode);
            },
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

        if (!allDependenciesMet && missingDependencies && _.isArray(missingDependencies)) {
          missingDependencies.push(course.rawpre);
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
    info,
  }) {
    const sectionQueueMap = await this.findCandidateSectionQueueMap({
      completedCourses,
      requiredCourses,
      term: termPreference.term,
    });

    // Return immediately since no possible schedule to generate.
    if (sectionQueueMap.size === 0) {
      info.push('No sections available for this term.');
      return [];
    }

    // Convert map to primitive object because I can't deal with remembering what
    // is a primitive object and what is a Map object
    const courseCodeSectionArrayMap = Util.objectFromMap(sectionQueueMap);

    // Only keep the keys of the map that correspond to the courses specicied
    // in requestedCourses
    const requestedCouseCodeSectionArrayMap = {};
    Object.keys(courseCodeSectionArrayMap)
      .filter(key => termPreference.requestedCourses.map(e => (_.isString(e) ? e : e.code)).includes(key))
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

    // Filter possible combinations within each course section group based on their
    // codes. Tutorials are restricted to the lecture component based on their
    // first or both first and second letters. For example, lecture with code "U"
    // can take tutorials with code "U UA" or "U UC", and lecture code "DD" can
    // take tutorials with code "DDDA" and "DDDC". For single letter lecture codes,
    // the corresponding tutorial codes must start with this letter and a space.
    // For two letter lecture codes, the corresponding tutorials must start with
    // both letters. Labs do not seem to have any restrictions based on lecture
    // codes.
    Object.keys(courseCodeSectionCombinationArrayMap).forEach((courseCode) => {
      const sectionCombinationSliceIndices = [];

      courseCodeSectionCombinationArrayMap[courseCode].forEach((sectionCombinationArray, combinationIdx) => {
        const lec = _.find(sectionCombinationArray, section => section.kind === 'LEC');
        const tut = _.find(sectionCombinationArray, section => section.kind === 'TUT');

        let shouldSplice = false;

        if (lec.code.length === 1) {
          if (tut && !tut.code.startsWith(`${lec.code} `)) { // Should contain space
            shouldSplice = true;
          }
        } else if (lec.code.length === 2) {
          if (tut && !tut.code.startsWith(`${lec.code}`)) {
            shouldSplice = true;
          }
        }

        if (shouldSplice) {
          sectionCombinationSliceIndices.push(combinationIdx);
        }
      });

      // Must remove each element in reverse to not mess up the resulting splice
      // everytime the array reshapes.
      sectionCombinationSliceIndices.reverse().forEach((idx) => {
        courseCodeSectionCombinationArrayMap[courseCode].splice(idx, 1);
      });
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
    const nSchedules = schedules.length;

    // Filter all schedules by whether they present a conflict. Note here we're
    // using splice instead of filter because this array can be huge and copying
    // the contents over again can become costly in terms of memory and time
    const spliceScheduleIndices = [];
    schedules.forEach((e, i) => {
      if (e.hasConflict()) {
        spliceScheduleIndices.push(i);
      }
    });

    // Must remove each element in reverse to not mess up the resulting splice
    // everytime the array reshapes.
    spliceScheduleIndices.reverse().forEach((spliceIdx) => {
      schedules.splice(spliceIdx, 1); // Remove this element only
    });

    if (schedules.length !== (nSchedules - spliceScheduleIndices.length)) {
      throw new Error('findCandidateTermSchedules: nSchedules\' != nSchedule - nConflicts.');
    }

    if ((!schedules.length || schedules.length === 0) && nSchedules > 0) {
      info.push('No possible combinations of sections were possible.');
    }

    return schedules;
  }

  static async findCandidateSchedules({
    completedCourses,
    requiredCourses,
    preferences,
    info,
  }) {
    let updatedCompletedCourses = completedCourses;

    const fallSchedules = await this.findCandidateTermSchedules({
      completedCourses: updatedCompletedCourses,
      requiredCourses,
      termPreference: preferences.fall,
      info: info || [],
    });

    // Extract the courses from the schedules by using the first element
    const fallCourses = fallSchedules[0] ?
      this.findCoursesFromSections(fallSchedules[0].sections) : [];

    // Include the courses to be taken in fall
    updatedCompletedCourses = [ ...updatedCompletedCourses, ...fallCourses ];

    const winterSchedules = await this.findCandidateTermSchedules({
      completedCourses: updatedCompletedCourses,
      requiredCourses,
      termPreference: preferences.winter,
      info,
    });

    // Extract the courses from the schedules by using the first element
    const winterCourses = winterSchedules[0] ?
      this.findCoursesFromSections(winterSchedules[0].sections) : [];

    // Include the courses to be taken in winter
    updatedCompletedCourses = [ ...updatedCompletedCourses, ...winterCourses ];

    const summerSchedules = await this.findCandidateTermSchedules({
      completedCourses: updatedCompletedCourses,
      requiredCourses,
      termPreference: preferences.summer,
      info,
    });

    return {
      fall: fallSchedules,
      winter: winterSchedules,
      summer: summerSchedules,
      info,
    };
  }

  static async findCandidateSequences({
    completedCourses,
    requiredCourses,
    preferences,
  }) {
    let completed = completedCourses.map(e => (_.isString(e) ? e : e.code));
    const required = requiredCourses;
    const termCourses = [];
    const terms = [ 'fall', 'winter', 'summer' ];
    const numberOfTerms = terms.length;
    const MAX_LOOP_ITERATIONS = 1000;

    let termTracker = 0;
    let year = (new Date()).getFullYear();
    const getTermYear = (year, termsPassed) => ((termsPassed % 3 === 0) ? year + 1 : year);
    // Offset required since Winter and Summer will have passed when starting sequence in Fall
    const termsPassedOffset = 2;

    // Get all candidate courses given currently completed courses
    let candidateCourses = await this.findCandidateCourses({
      completedCourses: completed,
      requiredCourses: required,
    });
    let currentLoopIteration = 0;
    while (_.difference(required, completed).length > 0) {
      currentLoopIteration += 1;
      year = getTermYear(year, termTracker + termsPassedOffset);
      if (preferences[terms[termTracker % numberOfTerms]].numberOfCourses !== 0) {
        // Of the candidate courses, pick at most the number specified in
        // termPreferences, and add those to the lot of completedCOurses
        // eslint-disable-next-line
        const sequence = new Sequence({
          term: terms[termTracker % numberOfTerms],
          year,
          courses: candidateCourses.slice(0,
            preferences[terms[termTracker % numberOfTerms]].numberOfCourses),
        });
        termCourses.push(sequence);
        completed = _.uniq([ ...completed, ..._.flatten(sequence.courses.map(e => e.code)) ]);
        // eslint-disable-next-line
        candidateCourses = await this.findCandidateCourses({
          completedCourses: completed,
          requiredCourses: required,
        });
      }
      termTracker += 1;

      if (currentLoopIteration >= MAX_LOOP_ITERATIONS) {
        throw new Error('Maximum number of sequence iterations attempted. Issue with requirements.');
      }
    }

    return termCourses;
  }

  static async findCandidatePlan({
    completedCourses,
    requiredCourses,
    preferences,
  }) {
    completedCourses = [ ...completedCourses.map(e => (e.code ? e.code : e)) ];
    requiredCourses = [ ...requiredCourses.map(e => (e.code ? e.code : e)) ];
    if (preferences.fall.requestedCourses && !!preferences.fall.requestedCourses.length) {
      preferences.fall.requestedCourses = preferences.fall.requestedCourses.map(e => (e.code ? e.code : e));
    }
    if (preferences.winter.requestedCourses && !!preferences.winter.requestedCourses.length) {
      preferences.winter.requestedCourses = preferences.winter.requestedCourses.map(e => (e.code ? e.code : e));
    }
    if (preferences.summer.requestedCourses && !!preferences.summer.requestedCourses.length) {
      preferences.summer.requestedCourses = preferences.summer.requestedCourses.map(e => (e.code ? e.code : e));
    }

    const info = [];
    const candidateSchedules = await this.findCandidateSchedules({
      completedCourses,
      requiredCourses,
      preferences,
      info,
    });

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
    const candidateSequences = await this.findCandidateSequences({
      completedCourses: updatedCompletedCourses,
      requiredCourses,
      preferences,
    });

    // Given the TermPreference in preferences for each term, sort the schedules
    // array such that the Schedule elements with a 'higher priority' appears as
    // the front of the array in a priority queue like fashion. Note the sorting
    // here is done in place for the same reason as when we used splice inside
    // findCandidateTermSchedules(...).
    const plan = new Plan({
      schedules: candidateSchedules,
      sequences: candidateSequences,
    });

    plan.sortSchedules({ preferences });

    // Limit the number of schedules for each term to 50.
    plan.schedules.fall.splice(50);
    plan.schedules.winter.splice(50);
    plan.schedules.summer.splice(50);

    const unableToAddReasonsMap = {
      fall: {},
      winter: {},
      summer: {},
    };
    // Retrieve missing requisites for courses not able to
    const ableToAddCoursesMap = {
      fall: plan.schedules.fall[0] && !!plan.schedules.fall[0].sections.length ? this.findCoursesFromSections(plan.schedules.fall[0].sections) : null,
      winter: plan.schedules.winter[0] && !!plan.schedules.winter[0].sections.length ? this.findCoursesFromSections(plan.schedules.winter[0].sections) : null,
      summer: plan.schedules.summer[0] && !!plan.schedules.summer[0].sections.length ? this.findCoursesFromSections(plan.schedules.summer[0].sections) : null,
    };
    const unableToAddCoursesMap = {
      fall: _.difference(preferences.fall.requestedCourses.map(e => (e.code ? e.code : e)), ableToAddCoursesMap.fall),
      winter: _.difference(preferences.winter.requestedCourses.map(e => (e.code ? e.code : e)), ableToAddCoursesMap.winter),
      summer: _.difference(preferences.summer.requestedCourses.map(e => (e.code ? e.code : e)), ableToAddCoursesMap.summer),
    };

    const ctx = {
      fall: {
        reasons: {},
        completedCourses: [],
        hasNoUnmetDependencies: null,
        unableToAddCourses: unableToAddCoursesMap.fall,
        ableToAddCourses: ableToAddCoursesMap.fall,
        requestedCourses: preferences.fall.requestedCourses.map(e => (e.code ? e.code : e)),
      },
      winter: {
        reasons: {},
        completedCourses: [],
        hasNoUnmetDependencies: null,
        unableToAddCourses: unableToAddCoursesMap.winter,
        ableToAddCourses: ableToAddCoursesMap.winter,
        requestedCourses: preferences.winter.requestedCourses.map(e => (e.code ? e.code : e)),
      },
      summer: {
        reasons: {},
        completedCourses: [],
        hasNoUnmetDependencies: null,
        unableToAddCourses: unableToAddCoursesMap.summer,
        ableToAddCourses: ableToAddCoursesMap.summer,
        requestedCourses: preferences.summer.requestedCourses.map(e => (e.code ? e.code : e)),
      },
    };

    // eslint-disable-next-line no-restricted-syntax
    for (const termKey of [ 'fall', 'winter', 'summer' ]) {
      // eslint-disable-next-line no-await-in-loop
      const termMapQueue = await this.getMapQueueSections({ candidateCourses: ctx[termKey].requestedCourses, term: termKey.toUpperCase() });
      const termObjectQueue = Util.objectFromMap(termMapQueue);
      ctx[termKey].objectQueue = termObjectQueue;

      const termAvailableSections = Object.keys(termObjectQueue);
      ctx[termKey].availableSections = termAvailableSections;
    }


    Object.keys(unableToAddCoursesMap).forEach((termKey) => {
      let updatedCompletedCourses;

      if (termKey === 'fall') {
        updatedCompletedCourses = completedCourses.map(e => (e.code ? e.code : e));
      } else if (termKey === 'winter') {
        updatedCompletedCourses = [
          ...completedCourses.map(e => (e.code ? e.code : e)),
          ...(ableToAddCoursesMap.fall ? ableToAddCoursesMap.fall : []),
        ];
      } else if (termKey === 'summer') {
        updatedCompletedCourses = [
          ...completedCourses.map(e => (e.code ? e.code : e)),
          ...(ableToAddCoursesMap.fall ? ableToAddCoursesMap.fall : []),
          ...(ableToAddCoursesMap.winter ? ableToAddCoursesMap.winter : []),
        ];
      } else {
        throw new Error('Something went wrong!');
      }

      updatedCompletedCourses = _.uniq(updatedCompletedCourses);
      ctx[termKey].completedCourses = updatedCompletedCourses;

      const hasNoUnmetDependencies = this.hasNoUnmetDependenciesPartial({ completedCourses: updatedCompletedCourses });
      ctx[termKey].hasNoUnmetDependencies = hasNoUnmetDependencies;


      // eslint-disable-next-line
      for (const unableToAddCourse of unableToAddCoursesMap[termKey]) {
        const reason = [];
        if (!hasNoUnmetDependencies(unableToAddCourse, reason)) {
          // Missing dependency
          unableToAddReasonsMap[termKey][unableToAddCourse] = reason[0] ? reason[0].trim() : 'Unmet course dependency';
        } else if (ctx[termKey].completedCourses.includes(unableToAddCourse)) {
          unableToAddReasonsMap[termKey][unableToAddCourse] = 'Course already taken';
        } else if (ctx[termKey].availableSections.includes(unableToAddCourse)) {
          unableToAddReasonsMap[termKey][unableToAddCourse] = 'No sections possible';
        } else if (!ctx[termKey].availableSections.includes(unableToAddCourse)) {
          unableToAddReasonsMap[termKey][unableToAddCourse] = 'No sections available';
        }

        ctx[termKey].reasons[unableToAddCourse] = reason;
      }
    });

    // eslint-disable-next-line
    preferences.unableToAddReasonsMap = unableToAddReasonsMap;

    return plan;
  }
}

module.exports = { ProgramBuilder };
