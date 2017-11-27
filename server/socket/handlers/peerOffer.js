module.exports = function handlePeerOffer(peerId, RTCSessionDescription = false) {
  if (!RTCSessionDescription) return;
  this.ss.to(peerId, 'peerOffer', this.clientSocket.id, RTCSessionDescription);
};
