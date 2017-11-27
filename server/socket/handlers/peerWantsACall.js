module.exports = function handlePeerWantsACall() {
  this.cs.air('peerWantsACall', this.clientSocket.id);
};
