module.exports = function handlePeerAnswer(peerId, answer = false) {
  if (!this.users[peerId]) return;
  if (!answer) return;

  this.ss.to(peerId, 'peerAnswer', this.clientSocket.id, answer);

  // link these two users together
  this.users[this.clientSocket.id].peers[peerId] = true;
  this.users[peerId].peers[this.clientSocket.id] = true;
};
