module.exports = function handlePeerIce(peerId, RTCIceCandidate = false) {
  if (!RTCIceCandidate) return;
  this.ss.to(peerId, 'peerIce', this.clientSocket.id, RTCIceCandidate);
};
