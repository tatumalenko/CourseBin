class TimeBlock {
  constructor({
    startTime,
    endTime,
    weekDay,
  }) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.weekDay = weekDay;
  }
}

module.exports = { TimeBlock };
