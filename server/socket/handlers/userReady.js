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
  room.insertUserData(clientId, userData.name, userData.uri);

  // send user data to other user
  const otherUsers = room.otherUsers(clientId);
  otherUsers.forEach((peerId) => {
    this.ss.to(peerId, 'peerUpdate', clientId, data);
  });

  // if the room is full and all users are ready send a message to the rest
  if (room.isFull && room.allUsersReady) {
    this.ss.emit('signalingServerMessage', 'allUsersReady');
  }
};
