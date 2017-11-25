module.exports = function notifyPeersOfDisconnect(socketId) {
  // send to peers that their buddy disconnected
  this.users[socketId].peers.forEach((peer) => {
    this.ss.to(peer, 'peerDisconnect', socketId);
  });
};
