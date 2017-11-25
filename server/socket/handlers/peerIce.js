module.exports = function handlePeerIce(peerId, o = false) {
  if (!this.users[peerId]) return;
  if (!o) return;

  io.to(peerId).emit('peerIce', this.clientSocket.id, o);
};
