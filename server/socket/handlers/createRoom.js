const superb = require('superb');

const newRoomName = (rooms) => {
  const roomName = superb();
  if (rooms[roomName]) return newRoomName();
  return roomName;
};

module.exports = function createRoom() {
  const roomNames = Object.keys(this.store.rooms);
  if (roomNames.length >= this.store.maxRooms) {
    this.ss.to(this.clientSocket.id, 'signalingServerMessage', "The server is at it's maximum amount of rooms. Try again later"); /* prettier-ignore */
    return;
  }

  const roomName = newRoomName(this.store.rooms);
  this.store.rooms[roomName] = [
    this.clientSocket.id,
  ];

  this.ss.to(this.clientSocket.id, 'signalingServerMessage', roomName);
};
