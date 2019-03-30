const { Catalog } = require('./Catalog');
const { Location } = require('./Location');
const { TimeBlock } = require('./TimeBlock');

class Section {
  constructor({
    courseCode,
    code,
    kind,
    location,
    mode,
    times,
  }) {
    this.courseCode = courseCode;
    this.code = code;
    this.title = Catalog.find({ code: courseCode }).title;
    this.kind = kind;
    this.mode = mode;
    this.location = new Location(location);
    this.times = [ ...times ].map(e => new TimeBlock(e)); // Needed to convert to primitive Array
  }
}

module.exports = { Section };
