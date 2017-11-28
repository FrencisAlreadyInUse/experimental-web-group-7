module.exports = class Store {
  constructor() {
    this.maxRooms = 5;
    this.rooms = {};
    this.users = {};

    this.bindClassMethods();
  }

  bindClassMethods() {
    // eslint-disable-next-line no-restricted-syntax
    for (const method in this) {
      if (typeof this[method] === 'function') {
        this[method] = this[method].bind(this);
      }
    }
  }

  get roomNames() {
    return Object.keys(this.rooms);
  }

  get roomCount() {
    return this.roomNames.length;
  }

  get roomsFull() {
    return this.roomCount >= this.maxRooms;
  }

  roomExists(roomName) {
    const room = this.rooms[roomName];
    return !!room;
  }

  getRoom(roomName) {
    return this.rooms[roomName] || null;
  }

  addRoom(roomName, room) {
    this.rooms[roomName] = room;
  }

  removeRoom(roomName) {
    if (!this.getRoom(roomName)) return;
    delete this.rooms[roomName];
  }
};
