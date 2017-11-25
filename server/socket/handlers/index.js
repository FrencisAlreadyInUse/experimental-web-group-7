module.exports = params => ({
  peerWantsACall: require('./peerWantsACall').bind(params),
  peerOffer: require('./peerOffer').bind(params),
  peerAnswer: require('./peerAnswer').bind(params),
  peerIce: require('./peerIce').bind(params),
  notifyPeersOfDisconnect: require('./notifyPeersOfDisconnect').bind(params),
  removePeerFromUsers: require('./removePeerFromUsers').bind(params),
});
