class Location {
  constructor({
    code,
    building,
    room,
  }) {
    this.code = code;
    this.building = building;
    this.room = room;
  }
}

module.exports = { Location };
