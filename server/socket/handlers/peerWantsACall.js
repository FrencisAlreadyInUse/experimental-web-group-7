module.exports = function handlePeerWantsACall() {
  if (!this.users[this.clientSocket.id]) return;

  this.cs.air('peerWantsACall', this.clientSocket.id);
};
