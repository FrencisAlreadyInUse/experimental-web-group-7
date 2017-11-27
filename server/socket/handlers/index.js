module.exports = params => ({
  createRoom: require('./createRoom').bind(params),
  peerWantsACall: require('./peerWantsACall').bind(params),
  peerOffer: require('./peerOffer').bind(params),
  peerAnswer: require('./peerAnswer').bind(params),
  peerIce: require('./peerIce').bind(params),
  disconnect: require('./disconnect').bind(params),
});
