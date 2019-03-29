const { Course } = require('./Course');

class Sequence {
  constructor({ term, year, courses }) {
    this.term = term;
    this.year = year;
    this.courses = courses.map(course => new Course(course));
  }
}

module.exports = { Sequence };
