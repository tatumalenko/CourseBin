const _ = require('lodash');

const { Catalog } = require('./Catalog');
const { Timetable } = require('./Timetable');

class ScheduleBuilder {
  static findUncompletedCourses({ requiredCourses, completedCourses }) {
    return _.difference(requiredCourses, completedCourses);
  }

  static hasNoUnmetDependenciesPartial({ completedCourses }) {
    return async (uncompletedCourse) => {
      let allDependenciesMet;
      try {
        const course = await Catalog.findOne({ code: uncompletedCourse });
        allDependenciesMet = course.prerequisiteCodes ? course.prerequisiteCodes.every(
          prerequisiteOrCodes => prerequisiteOrCodes.some(
            prerequisiteCode => completedCourses.includes(prerequisiteCode),
          ),
        ) : true;
      } catch (err) {
        console.error(
          `Error caught for hasUnmetDependencies with uncompletedCourse: ${uncompletedCourse}`,
        );
        console.error(err);
      }
      return allDependenciesMet;
    };
  }

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

  static async findCandidateSchedules({ completedCourses, requiredCourses, term }) {
    const candidateCourses = await this.findCandidateCourses({ completedCourses, requiredCourses });
    return this.getMapQueueSections({ candidateCourses, term });
  }
}

module.exports = { ScheduleBuilder };
