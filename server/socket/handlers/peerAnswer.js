module.exports = function handlePeerAnswer(peerId, RTCSessionDescription = false) {
  if (!RTCSessionDescription) return;
  this.ss.to(peerId, 'peerAnswer', this.clientSocket.id, RTCSessionDescription);
};
