module.exports = function roomFull(roomName) {
  const clientId = this.clientSocket.id;

  // return if the room doesn't exist
  if (!this.store.roomExists(roomName)) {
    this.ss.to(clientId, 'signalingServerMessage', 'roomError', "This room doesn't exist.");
    return;
  }

  const roomInstance = this.store.getRoom(roomName);

  // get all the other users in the room
  roomInstance.otherUsers(clientId).forEach(userId => {
    // send to all the users in the room that they can go to user data section
    this.ss.to(userId, 'signalingServerMessage', 'roomFull');
  });
};
