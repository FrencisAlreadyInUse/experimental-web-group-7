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

  // if the room is closed return
  if (!roomInstance.open) {
    this.ss.to(clientId, 'signalingServerMessage', 'roomError', 'This room is closed.');
    return;
  }

  // add user to room
  roomInstance.addUser(clientId);

  // add user to users object
  this.store.users[clientId] = roomName;

  // send success message to user
  this.ss.to(clientId, 'signalingServerMessage', 'roomJoined', {
    name: roomName,
    userCount: roomInstance.amountUsers,
    maxUsers: roomInstance.maxUsers,
  });

  // get all the other users in the room
  roomInstance.otherUsers(clientId).forEach((userId) => {
    // send to all the users in the room that there is a new user
    this.ss.to(userId, 'peerWantsACall', this.clientSocket.id);

    // get the current user data
    const data = roomInstance.getUserData(userId);

    // don't send anything if the user doesn't have data
    if (!data.name || !this.uri) return;

    // send the user data to the connected user
    const userData = JSON.stringify(data);
    this.ss.to(clientId, 'peerUpdate', userId, userData);
  });
};
