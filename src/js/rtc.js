let socket = null;

const handlePeerWantsACall = (peerId) => {
  console.log('peer wants a call', peerId);
};

const handlePeerAnswer = (value) => {
  console.log(value);
};

const handlePeerIce = (value) => {
  console.log(value);
};

const init = () => {
  socket = io.connect('/');

  socket.on('connect', () => console.log(socket.id));
  socket.on('peerWantsACall', handlePeerWantsACall);
  socket.on('peerAnswer', handlePeerAnswer);
  socket.on('peerIce', handlePeerIce);
};

init();
