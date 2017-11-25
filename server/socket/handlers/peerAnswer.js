module.exports = function handlePeerAnswer(peerId, o = false) {
  if (!this.users[peerId]) return;
  if (!o) return;

  this.ss.to(peerId, 'peerAnswer', this.clientSocket.id, o);

  // link these two users together
  this.users[this.clientSocket.id].peers[peerId] = true;
  this.users[peerId].peers[this.clientSocket.id] = true;
};
