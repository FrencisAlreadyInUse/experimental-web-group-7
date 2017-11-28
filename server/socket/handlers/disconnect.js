module.exports = function disconnect() {
  const clientId = this.clientSocket.id;

  // find out in which room the client was joined in
  const clientRoomName = this.store.users[clientId];

  // if the user is not found in a room don't do anything
  if (!clientRoomName) return;

  // return if the room doesn't exist
  if (!this.store.roomExists(clientRoomName)) return;

  const roomInstance = this.store.getRoom(clientRoomName);

  // remove user from the room
  roomInstance.removeUser(clientId);

  // remove the room from the store if nobody is left
  // and return because there is no one left to notify
  if (roomInstance.isEmpty) {
    this.store.removeRoom(clientRoomName);
    return;
  }

  // remove user from the users object
  delete this.store.users[clientId];

  // send remaining users that clientId disconnected
  roomInstance.otherUsers(clientId).forEach((userId) => {
    this.ss.to(userId, 'peerDisconnect', clientId);
  });
};
