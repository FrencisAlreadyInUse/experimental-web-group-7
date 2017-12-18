module.exports = function userReady(data) {
  const clientId = this.clientSocket.id;

  // return if the user doesn't exist
  const roomName = this.store.users[clientId];
  if (!roomName) return;

  // return if the room doesn't exist
  const room = this.store.getRoom(roomName);
  if (!room) return;

  // add the user data to the user
  // and set user.ready to true
  const userData = JSON.parse(data);
  console.log(userData);
  room.insertUserData(clientId, userData.name, userData.uri);

  const updatedUserData = JSON.stringify(room.getUserData(clientId));

  // send user data to other user
  const otherUsers = room.otherUsers(clientId);
  otherUsers.forEach(peerId => {
    this.ss.to(peerId, 'peerUpdate', clientId, updatedUserData);

    // if the room is full and all users are ready tell peers that game can start
    if (room.isFull && room.allUsersReady) {
      this.ss.to(peerId, 'roomUsersReady');
    }
  });

  // also send to clientId that game can start
  if (room.isFull && room.allUsersReady) {
    this.ss.to(clientId, 'roomUsersReady');
  }
};
