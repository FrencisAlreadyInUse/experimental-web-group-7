// import 'babel-polyfill'; // eslint-disable-line

let SignalingServer = null;

const connections = {};
window.connections = connections;
const serverOptions = { iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }] };
const dataOptions = { ordered: false, maxRetransmitTime: 1000 };
const newUser = { conn: null, channel: null };
const $button = document.querySelector('#button');

// ///////////////////////////////////////////////////////////////////////////:

const log = (...data) => console.log('%c LOG ', 'background: orange; color: white', ...data);

const message = (...data) => console.log('%c LOG ', 'background: green; color: white', ...data);

const error = err => console.error(err.message);

// ///////////////////////////////////////////////////////////////////////////:

const send = (...data) => {
  const connectionIds = Object.keys(connections);
  // log('connectionIds', connectionIds);

  connectionIds.forEach((connId) => {
    if (!connections[connId].channel) return;
    if (connections[connId].channel.readyState !== 'open') return;

    connections[connId].channel.send(...data);
  });
};

window.send = send;

// ///////////////////////////////////////////////////////////////////////////:

const onPeerWantsACall = (peerId) => {
  if (connections[peerId]) return;

  log('onPeerWantsACall', peerId);

  connections[peerId] = newUser;
  connections[peerId].conn = new RTCPeerConnection(serverOptions, null);
  const current = connections[peerId];

  current.channel = current.conn.createDataChannel('datachannel', dataOptions);

  current.conn.addEventListener('datachannel', (event) => {
    current.channel = event.channel;
  });

  current.conn.addEventListener('icecandidate', (RTCPeerConnectionIceEvent) => {
    if (!RTCPeerConnectionIceEvent.candidate) return;

    SignalingServer.emit('peerIce', peerId, RTCPeerConnectionIceEvent.candidate);
  });

  current.conn.addEventListener('negotiationneeded', () => {
    current.conn
      .createOffer()
      .then((LocalRTCSessionDescription) => {
        current.conn.setLocalDescription(LocalRTCSessionDescription);
        SignalingServer.emit('peerOffer', peerId, LocalRTCSessionDescription);
      })
      .catch(error);
  });

  current.channel.addEventListener('open', () => {
    current.channel.addEventListener('message', MessageEvent => message(MessageEvent.data));
  });
};

// ///////////////////////////////////////////////////////////////////////////:

const onPeerOffer = (peerId, RemoteRTCSessionDescription) => {
  if (connections[peerId]) return;

  log('onPeerOffer', peerId);

  connections[peerId] = newUser;
  connections[peerId].conn = new RTCPeerConnection(serverOptions, null);
  const current = connections[peerId];

  current.conn
    .setRemoteDescription(RemoteRTCSessionDescription)
    .then(() => current.conn.createAnswer())
    .then((LocalRTCSessionDescription) => {
      current.conn.setLocalDescription(LocalRTCSessionDescription);
      SignalingServer.emit('peerAnswer', peerId, LocalRTCSessionDescription);
    })
    .catch(error);

  current.conn.addEventListener('icecandidate', (RTCPeerConnectionIceEvent) => {
    if (!RTCPeerConnectionIceEvent.candidate) return;

    SignalingServer.emit('peerIce', peerId, RTCPeerConnectionIceEvent.candidate);
  });

  current.conn.addEventListener('datachannel', (RTCDataChannelEvent) => {
    if (!RTCDataChannelEvent.channel) return;

    current.channel = RTCDataChannelEvent.channel;

    current.channel.addEventListener('open', () => {
      current.channel.addEventListener('message', MessageEvent => message(MessageEvent.data));
    });

    current.channel.addEventListener('close', () => log('datachannel closed'));
  });
};

// ///////////////////////////////////////////////////////////////////////////:

const onPeerAnswer = (peerId, RemoteRTCSessionDescription) => {
  if (!connections[peerId]) return;

  connections[peerId].conn.setRemoteDescription(RemoteRTCSessionDescription);
};

// ///////////////////////////////////////////////////////////////////////////:

const onPeerIce = (peerId, RTCIceCandidate) => {
  if (!RTCIceCandidate.candidate) return;
  if (!connections[peerId]) return;

  connections[peerId].conn.addIceCandidate(RTCIceCandidate);
};

// ///////////////////////////////////////////////////////////////////////////:

const init = () => {
  SignalingServer = io.connect('/');

  SignalingServer.on('connect', () => log(SignalingServer.id));

  SignalingServer.on('peerWantsACall', onPeerWantsACall);
  SignalingServer.on('peerOffer', onPeerOffer);
  SignalingServer.on('peerAnswer', onPeerAnswer);
  SignalingServer.on('peerIce', onPeerIce);

  $button.addEventListener('click', () => {
    SignalingServer.emit('peerWantsACall');
  });
};

init();
