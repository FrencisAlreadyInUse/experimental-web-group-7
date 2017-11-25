module.exports = function handlePeerWantsACall(peerId) {
  if (!this.users[peerId]) return;

  io.to(peerId).emit('peerWantsACall', this.clientSocket.id);
};
