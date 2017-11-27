module.exports = function handlePeerOffer(peerId, offer = false) {
  if (!this.users[peerId]) return;
  if (!offer) return;

  this.ss.to(peerId, 'peerOffer', this.clientSocket.id, offer);
};
