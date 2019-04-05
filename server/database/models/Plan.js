const _ = require('lodash');

class Plan {
  constructor({ schedules, sequences }) {
    this.schedules = {
      fall: schedules.fall,
      winter: schedules.winter,
      summer: schedules.summer,
    };
    this.sequences = sequences;
  }

  sortSchedules({ preferences }) {
    // Sorts the array of Schedule object in place such that the front elements
    // represent a higher 'priority' in accordance to the TermPreference argument.
    // In other words, the Schedule element at index 0 should represent the
    // schedule that most closely matches the preferences passed (e.g. such
    // as the eveningTimePreference option, etc).
    const weightMap = {
      '08.00.00': {
        early: 12,
        late: -2,
      },
      '10.00.00': {
        early: 10,
        late: 2,
      },
      '12.00.00': {
        early: 8,
        late: 4,
      },
      '14.00.00': {
        early: 6,
        late: 6,
      },
      '16.00.00': {
        early: 4,
        late: 8,
      },
      '18.00.00': {
        early: 2,
        late: 10,
      },
      '20.00.00': {
        early: -2,
        late: 12,
      },
    };

    const scheduleWeight = (schedule, termPreference) => {
      let earlyScore = 0;
      let lateScore = 0;

      const scheduleTimeBlocks = _.flatten(
        schedule.sections.map(section => section.times),
      );

      scheduleTimeBlocks.forEach((timeBlock) => {
        Object.keys(weightMap).forEach((timeKey, timeIdx) => {
          if (timeBlock.startTime >= timeKey &&
            (Object.keys(weightMap).length - 1 >= timeIdx + 1 ?
              timeBlock.startTime < Object.keys(weightMap)[timeIdx + 1] :
              true)) {
            earlyScore += weightMap[timeKey].early;
            lateScore += weightMap[timeKey].late;
          }
        });
      });

      return termPreference.eveningTimePreference ? lateScore : earlyScore;
    };

    this.schedules.fall.sort(
      (s1, s2) => scheduleWeight(s2, preferences.fall) - scheduleWeight(s1, preferences.fall),
    );
    this.schedules.winter.sort(
      (s1, s2) => scheduleWeight(s2, preferences.winter) - scheduleWeight(s1, preferences.winter),
    );
    this.schedules.summer.sort(
      (s1, s2) => scheduleWeight(s2, preferences.summer) - scheduleWeight(s1, preferences.summer),
    );
  }
}

module.exports = { Plan };
