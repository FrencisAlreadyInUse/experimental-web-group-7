module.exports = function userReady(data) {
  const clientId = this.clientSocket.id;

  // return if the user doesn't exist
  const roomName = this.store.users[clientId];
  if (!roomName) return;

  // return if the room doesn't exist
  const roomInstance = this.store.getRoom(roomName);
  if (!roomInstance) return;

  // add the user data to the user
  // and set user.ready to true
  const userData = JSON.parse(data);
  roomInstance.insertUserData(clientId, userData.name, userData.uri);

  const updatedUserData = JSON.stringify(roomInstance.getUserData(clientId));

  // send user data to other user
  const otherUsers = roomInstance.otherUsers(clientId);
  otherUsers.forEach(peerId => {
    this.ss.to(peerId, 'peerUpdate', clientId, updatedUserData);

    // if the room is full and all users are ready tell peers that game can start
    if (roomInstance.isFull && roomInstance.allUsersReady) {
      this.ss.to(peerId, 'roomUsersReady', roomInstance.maxUsers);
    }
  });

  // also send the user data to the clientId itself
  this.ss.to(clientId, 'peerUpdate', clientId, updatedUserData);

  // also send to clientId that game can start
  if (roomInstance.isFull && roomInstance.allUsersReady) {
    this.ss.to(clientId, 'roomUsersReady', roomInstance.maxUsers);
  }
};
