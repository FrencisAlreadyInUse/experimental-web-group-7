module.exports = function handlePeerIce(peerId, data = false) {
  if (!this.users[peerId]) return;
  if (!data) return;

  this.ss.to(peerId, 'peerIce', this.clientSocket.id, data);
};
