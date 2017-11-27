module.exports = function disconnect() {
  if (!this.users[this.clientSocket.id]) return;

  // send to peers that their buddy disconnected
  this.users[this.clientSocket.id].peers.forEach((peer) => {
    this.ss.to(peer, 'peerDisconnect', this.clientSocket.id);
  });

  // delete our buddy from the users object and from all other peers
  this.users[this.clientSocket.id].peers.forEach((peer) => {
    if (!this.users[peer]) return;
    delete this.users[peer].peers[this.clientSocket.id]; // remove buddy from each peer it had
  });
  delete this.users[this.clientSocket.id]; // finally remove buddy from users
};
