const _ = require('lodash');
const { Catalog } = require('./Catalog');

class Course {
  constructor(courseStringOrObject) {
    // Depending on whether the input argument is a String or Object, we may need
    // to query the Catalog class to populate properties.
    if (_.isString(courseStringOrObject)) {
      // Input argument is a String, query the proper Catalog entry and populate this.
      const catalogCourse = Catalog.findOne({ code: courseStringOrObject });

      // If Catalog did not recognize any entries with the provided String code,
      // then throw an error to the caller.
      if (!catalogCourse) {
        throw new Error(`Course.constructor: Course code ${courseStringOrObject} was not found.`);
      }

      this.code = catalogCourse.code;
      this.title = catalogCourse.title;
      this.credits = catalogCourse.credits;
      this.rawpre = catalogCourse.rawpre;
      this.prerequisiteCodes = catalogCourse.prerequisiteCodes;
      this.corequisiteCodes = catalogCourse.corequisiteCodes;
      this.equivalentCodes = catalogCourse.equivalentCodes;
    } else {
      // Input argument is not a String and thus assumed to be a Course object
      // already -> simply clone it over to this.
      this.code = courseStringOrObject.code;
      this.title = courseStringOrObject.title;
      this.credits = courseStringOrObject.credits;
      this.rawpre = courseStringOrObject.rawpre;
      this.prerequisiteCodes = courseStringOrObject.prerequisiteCodes;
      this.corequisiteCodes = courseStringOrObject.corequisiteCodes;
      this.equivalentCodes = courseStringOrObject.equivalentCodes;
    }
  }
}

module.exports = { Course };
