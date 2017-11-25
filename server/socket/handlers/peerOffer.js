module.exports = function handlePeerOffer(peerId, o = false) {
  if (!this.users[peerId]) return;
  if (!o) return;

  this.io.to(peerId).emit('peerOffer', this.clientSocket.id, o);
};
