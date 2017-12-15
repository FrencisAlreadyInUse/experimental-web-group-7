module.exports = params => ({
  handleCreateRoom: require('./createRoom').bind(params),
  handleJoinRoom: require('./joinRoom').bind(params),
  handleOpenRoom: require('./openRoom').bind(params),
  handleRoomFull: require('./roomFull').bind(params),
  handleUserReady: require('./userReady').bind(params),

  handlePeerOffer: require('./peerOffer').bind(params),
  handlePeerAnswer: require('./peerAnswer').bind(params),
  handlePeerIce: require('./peerIce').bind(params),

  handleDisconnect: require('./disconnect').bind(params),
});
