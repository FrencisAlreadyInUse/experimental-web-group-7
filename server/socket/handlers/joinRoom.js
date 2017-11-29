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

  // get all the other users in the room
  roomInstance.otherUsers(clientId).forEach((userId) => {
    // send to all the users in the room that there is a new user
    this.ss.to(userId, 'peerWantsACall', this.clientSocket.id);

    // send the current user data to the new user
    const data = JSON.stringify(roomInstance.getUserData(userId));
    this.ss.to(clientId, 'peerUpdate', userId, data);
  });
};
