module.exports = function joinRoom(roomName) {
  const clientId = this.clientSocket.id;

  // return if the room doesn't exist
  if (!this.store.roomExists(roomName)) {
    this.ss.to(clientId, 'signalingServerMessage', 'roomError', "This room doesn't exist.");
    return;
  }

  const roomInstance = this.store.getRoom(roomName);

  // if the room is full return
  if (roomInstance.isFull) {
    this.ss.to(clientId, 'signalingServerMessage', 'roomError', 'This room is full.');
    return;
  }

  // add user to room
  roomInstance.addUser(clientId);

  // add user to users object
  this.store.users[clientId] = roomName;

  // send success message to user
  this.ss.to(clientId, 'signalingServerMessage', 'roomJoined', roomName);

  // send to all the users in the room that there is a new user
  roomInstance.otherUsers(clientId).forEach((userId) => {
    this.ss.to(userId, 'peerWantsACall', this.clientSocket.id);
  });
};