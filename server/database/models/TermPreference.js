class TermPreference {
  constructor({
    term = null,
    numberOfCourses = 5,
    requestedCourses = null,
    eveningTimePreference = false,
    timeOfDay = null,
    offDays = null,
  }) {
    if (!term) {
      throw new Error('TermPreference.constructor: Must specify term!');
    }

    this.term = term;
    this.numberOfCourses = numberOfCourses;
    this.requestedCourses = requestedCourses;
    this.eveningTimePreference = eveningTimePreference;
    this.timeOfDay = eveningTimePreference ? 'EVENING' : timeOfDay;
    this.offDays = offDays;
  }
}

module.exports = { TermPreference };
