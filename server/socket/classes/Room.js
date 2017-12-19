const superb = require('superb');

module.exports = class Room {
  constructor(userId) {
    this.maxUsers = 5;
    this.creator = userId;
    this.users = {};
    this.open = false;

    this.bindClassMethods();
    this.addUser(userId);
  }

  bindClassMethods() {
    // eslint-disable-next-line no-restricted-syntax
    for (const name of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
      const method = this[name];
      // eslint-disable-next-line no-continue
      if (!(method instanceof Function) || method === Room) continue;
      this[name] = this[name].bind(this);
    }
  }

  static generateName(currentRoomNames) {
    const roomName = superb();

    // regenerate if name is already taken or if name contains a dash
    if (
      currentRoomNames.indexOf(roomName) !== -1 ||
      roomName.indexOf('-') !== -1 ||
      roomName.indexOf(' ') !== -1 ||
      roomName.length > 10
    ) {
      return Room.generateName(currentRoomNames);
    }

    return roomName;
  }

  get amountUsers() {
    return Object.keys(this.users).length;
  }

  get isEmpty() {
    return this.amountUsers === 0;
  }

  get isFull() {
    return this.amountUsers === this.maxUsers;
  }

  get allUsersReady() {
    // eslint-disable-next-line guard-for-in
    for (const id in this.users) {
      if (!this.users[id].ready) return false;
    }

    return true;
  }

  addUser(userId, name = null, uri = null) {
    this.users[userId] = {
      name,
      uri,
      order: this.amountUsers + 1,
      ready: false,
    };
  }

  insertUserData(userId, name = null, uri = null) {
    this.users[userId].name = name;
    this.users[userId].uri = uri;
    this.users[userId].ready = true;
  }

  getUserData(userId) {
    const user = this.users[userId];
    return {
      name: user.name,
      uri: user.uri,
      order: user.order,
    };
  }

  removeUser(userId) {
    if (!this.users[userId]) return;
    delete this.users[userId];
  }

  otherUsers(userId) {
    return Object.keys(this.users).filter(uid => uid !== userId);
  }
};
