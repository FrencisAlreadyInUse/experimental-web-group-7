const superb = require('superb');

module.exports = class Room {
  constructor(userId) {
    this.maxUsers = 5;
    this.creator = userId;
    this.users = {};
    this.open = true;

    this.bindClassMethods();
    this.addUser(userId);
  }

  bindClassMethods() {
    // eslint-disable-next-line no-restricted-syntax
    for (const method in this) {
      if (typeof this[method] === 'function') {
        this[method] = this[method].bind(this);
      }
    }
  }

  static generateName(currentRoomNames) {
    const roomName = superb();

    // regenerate if name is already taken or if name contains a dash
    if (currentRoomNames.indexOf(roomName) !== -1 || roomName.indexOf('-') !== -1) {
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

  addUser(userId, name = null, uri = null) {
    this.users[userId] = {
      name,
      uri,
      ready: false,
    };
  }

  insertUserData(userId, name = null, uri = null) {
    this.users[userId].name = name;
    this.users[userId].uri = uri;
    this.users[userId].ready = true;
  }

  getUserData(userId) {
    return {
      name: this.users[userId].name,
      uri: this.users[userId].uri,
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
