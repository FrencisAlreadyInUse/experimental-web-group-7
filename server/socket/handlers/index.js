module.exports = params => ({
  createRoom: require('./createRoom').bind(params),
  joinRoom: require('./joinRoom').bind(params),
  userReady: require('./userReady').bind(params),
  peerOffer: require('./peerOffer').bind(params),
  peerAnswer: require('./peerAnswer').bind(params),
  peerIce: require('./peerIce').bind(params),
  disconnect: require('./disconnect').bind(params),
});
