const { Preferences } = require('./Preferences');
const { TermPreference } = require('./TermPreference');

/*

We need to take the following into consideration when ranking schedules:

- day or evening
- number of courses
- requested courses?

*/

class Plan {
  constructor({ schedules, sequences }) {
    this.schedules = schedules;
    this.sequences = sequences;
  }

  static sortSchedules({ schedules, termPreference }) {
    // Sorts the array of Schedule object in place such that the front elements
    // represent a higher 'priority' in accordance to the TermPreference argument.
    // In other words, the Schedule element at index 0 should represent the
    // schedule that most closely matches the preferences passed (e.g. such
    // as the eveningTimePreference option, etc).
  }
}

module.exports = { Plan };
