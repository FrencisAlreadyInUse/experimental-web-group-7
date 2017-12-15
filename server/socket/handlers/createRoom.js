const Room = require('./../classes/Room');

module.exports = function createRoom() {
  const clientId = this.clientSocket.id;

  if (this.store.roomsFull) {
    this.ss.to(
      clientId,
      'signalingServerMessage',
      'roomError',
      "The server is at it's maximum amount of rooms. Try again later",
    );
    return;
  }

  // create new room and add current user in it
  // then add room to store
  const currentRoomNames = this.store.roomNames;
  const roomName = Room.generateName(currentRoomNames);
  const roomInstance = new Room(clientId);
  this.store.addRoom(roomName, roomInstance);

  // add user to users object
  this.store.users[clientId] = roomName;

  // send room name to user
  this.ss.to(clientId, 'signalingServerMessage', 'roomCreated', { name: roomName });
};
