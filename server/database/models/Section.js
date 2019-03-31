const { Catalog } = require('./Catalog');
const { Location } = require('./Location');
const { TimeBlock } = require('./TimeBlock');

class Section {
  constructor({
    courseCode,
    code,
    term,
    kind,
    location,
    mode,
    times,
    dates,
  }) {
    this.courseCode = courseCode;
    this.code = code;
    this.term = term;
    this.title = Catalog.find({ code: courseCode }) ? Catalog.find({ code: courseCode }).title : null;
    this.kind = kind;
    this.mode = mode;
    this.location = new Location(location);
    this.times = [ ...times ].map(e => new TimeBlock(e)); // Needed to convert to primitive Array
    this.dates = [ ...dates ]; // Needed to convert to primitive Array
  }
}

module.exports = { Section };
