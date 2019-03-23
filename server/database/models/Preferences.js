const TermPreference = require('./TermPreference');

class Preferences {
  constructor({ fall, winter, summer }) {
    this.fall = new TermPreference({
      term: 'FALL',
      numberOfCourses: fall.numberOfCourses,
      requestedCourses: fall.requestedCourses,
      eveningTimePreference: fall.eveningTimePreference,
      period: fall.period,
      days: fall.days,
    });


    this.winter = new TermPreference({
      term: 'WINTER',
      numberOfCourses: winter.numberOfCourses,
      requestedCourses: winter.requestedCourses,
      eveningTimePreference: winter.eveningTimePreference,
      period: winter.period,
      days: winter.days,
    });

    this.summer = new TermPreference({
      term: 'SUMMER',
      numberOfCourses: summer.numberOfCourses,
      requestedCourses: summer.requestedCourses,
      eveningTimePreference: summer.eveningTimePreference,
      period: summer.period,
      days: summer.days,
    });
  }
}

module.exports = { Preferences };
