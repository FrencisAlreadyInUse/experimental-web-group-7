module.exports = function removePeerFromUsers(socketId) {
  // delete our buddy from the users object and from all other peers
  this.users[socketId].peers.forEach((peer) => {
    if (!this.users[peer]) return;
    delete this.users[peer].peers[socketId]; // remove buddy from each peer it had
  });
  delete this.users[socketId]; // finally remove buddy from users
};
