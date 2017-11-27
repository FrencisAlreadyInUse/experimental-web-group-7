module.exports = function disconnect() {
  const clientId = this.clientSocket.id;
  const clientRoomName = this.store.users[clientId];

  // if the user is not found in a room don't do anything
  if (!clientRoomName) return;

  // remove user from the users object
  delete this.store.users[clientId];

  const clientRoomUsers = this.store.rooms[clientRoomName];

  // remove user from the room
  const index = clientRoomUsers.indexOf(clientId);
  if (index !== -1) clientRoomUsers.splice(index, 1);

  // remove room if there are no users left
  // and return (no one left to notify)
  if (clientRoomUsers.length === 0) {
    delete this.store.rooms[clientRoomName];
    return;
  }

  // send remaining users that clientId disconnected
  clientRoomUsers.forEach((roomUser) => {
    this.ss.to(roomUser, 'peerDisconnect', clientId);
  });
};
