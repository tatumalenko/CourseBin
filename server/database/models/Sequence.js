const _ = require('lodash');

const { Catalog } = require('./Catalog');
const { Course } = require('./Course');

class Sequence {
  // The constructor needs to make async calls to Catalog to assign its properties.
  // Hence it needs to wait, however this is not possible in JS to await in a ctor.
  // To remedy this, the constructor returns an IIFE with `this` as the return value.
  // This allows construction of objects to wait when calling `await new Sequence(...)`
  constructor({ term, year, courses }) {
    this.term = term;
    this.year = year;
    this.courses = [];

    // By allowing us to check each course element to see if it is a String or not,
    // we can populate the courses property with Course objects with flexibility.
    return (async () => {
      await Promise.all(courses.map((course) => {
        if (_.isString(course)) {
          const catalogCourse = Catalog.findOne({ code: course });
          return new Course(catalogCourse);
        }
        return course;
      })).then((results) => {
        this.courses.push(...results);
      }).catch((e) => {
        console.error(e);
      });

      return this;
    })();
  }
}

module.exports = { Sequence };
