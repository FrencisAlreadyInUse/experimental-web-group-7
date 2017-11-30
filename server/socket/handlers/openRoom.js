module.exports = function openRoom(roomName) {
  const clientId = this.clientSocket.id;

  // return if the room doesn't exist
  if (!this.store.roomExists(roomName)) {
    this.ss.to(clientId, 'signalingServerMessage', 'roomError', "This room doesn't exist.");
    return;
  }

  const roomInstance = this.store.getRoom(roomName);
  roomInstance.open = true;

  this.ss.to(clientId, 'signalingServerMessage', 'roomOpened', roomName);
};
