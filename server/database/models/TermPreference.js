class TermPreference {
  constructor({
    numberOfCourses = 5,
    requestedCourses = null,
    eveningTimePreference = false,
    timeOfDay = null,
    offDays = null,
  }) {
    this.numberOfCourses = numberOfCourses;
    this.requestedCourses = requestedCourses;
    this.eveningTimePreference = eveningTimePreference;
    this.timeOfDay = eveningTimePreference ? 'EVENING' : timeOfDay;
    this.offDays = offDays;
  }
}

module.exports = { TermPreference };
