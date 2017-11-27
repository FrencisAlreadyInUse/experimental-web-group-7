// import 'babel-polyfill';
import 'webrtc-adapter';

let SignalingServer = null;

const peers = {};

const RTCPeerConnectionOptions = { iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }] };
const RTCDataChannelOptions = { ordered: false, maxPacketLifeTime: 1000 };

const newPeer = { connection: null, channel: null };

const $button = document.querySelector('#button');

// ///////////////////////////////////////////////////////////////////////////:

const log = (...data) => {
  console.log('%c LOG ', 'background: orange; color: white', ...data);
};

const message = (...data) => {
  console.log('%c LOG ', 'background: green; color: white', ...data);
};

const error = (err) => {
  console.error(err.message);
};

// ///////////////////////////////////////////////////////////////////////////:

const send = (...data) => {
  const peerKeys = Object.keys(peers);

  peerKeys.forEach((peerId) => {
    if (!peers[peerId].channel) return;
    if (peers[peerId].channel.readyState !== 'open') return;

    peers[peerId].channel.send(...data);
  });
};

window.send = send;

// ///////////////////////////////////////////////////////////////////////////:

const onPeerWantsACall = (peerId) => {
  if (peers[peerId]) return;

  log('onPeerWantsACall', peerId);

  peers[peerId] = { ...newPeer };
  const Peer = peers[peerId];

  Peer.connection = new RTCPeerConnection(RTCPeerConnectionOptions, null);

  Peer.channel = Peer.connection.createDataChannel('datachannel', RTCDataChannelOptions);

  Peer.connection.addEventListener('datachannel', (event) => {
    Peer.channel = event.channel;
  });

  Peer.connection.addEventListener('icecandidate', (RTCPeerConnectionIceEvent) => {
    if (!RTCPeerConnectionIceEvent.candidate) return;

    SignalingServer.emit('peerIce', peerId, RTCPeerConnectionIceEvent.candidate);
  });

  Peer.connection.addEventListener('negotiationneeded', () => {
    Peer.connection
      .createOffer()
      .then((LocalRTCSessionDescription) => {
        Peer.connection.setLocalDescription(LocalRTCSessionDescription);
        SignalingServer.emit('peerOffer', peerId, LocalRTCSessionDescription);
      })
      .catch(error);
  });

  Peer.channel.addEventListener('open', () => {
    Peer.channel.addEventListener('message', MessageEvent => message(MessageEvent.data));
  });
};

// ///////////////////////////////////////////////////////////////////////////:

const onPeerOffer = (peerId, RemoteRTCSessionDescription) => {
  if (peers[peerId]) return;

  log('onPeerOffer', peerId);

  peers[peerId] = { ...newPeer };
  const Peer = peers[peerId];

  Peer.connection = new RTCPeerConnection(RTCPeerConnectionOptions, null);

  Peer.connection
    .setRemoteDescription(RemoteRTCSessionDescription)
    .then(() => Peer.connection.createAnswer())
    .then((LocalRTCSessionDescription) => {
      Peer.connection.setLocalDescription(LocalRTCSessionDescription);
      SignalingServer.emit('peerAnswer', peerId, LocalRTCSessionDescription);
    })
    .catch(error);

  Peer.connection.addEventListener('icecandidate', (RTCPeerConnectionIceEvent) => {
    if (!RTCPeerConnectionIceEvent.candidate) return;

    SignalingServer.emit('peerIce', peerId, RTCPeerConnectionIceEvent.candidate);
  });

  Peer.connection.addEventListener('datachannel', (RTCDataChannelEvent) => {
    if (!RTCDataChannelEvent.channel) return;

    Peer.channel = RTCDataChannelEvent.channel;

    Peer.channel.addEventListener('open', () => {
      Peer.channel.addEventListener('message', MessageEvent => message(MessageEvent.data));
    });

    Peer.channel.addEventListener('close', () => log('datachannel closed'));
  });
};

// ///////////////////////////////////////////////////////////////////////////:

const onPeerAnswer = (peerId, RemoteRTCSessionDescription) => {
  if (!peers[peerId]) return;

  peers[peerId].connection.setRemoteDescription(RemoteRTCSessionDescription);
};

// ///////////////////////////////////////////////////////////////////////////:

const onPeerIce = (peerId, RTCIceCandidate) => {
  if (!RTCIceCandidate.candidate) return;
  if (!peers[peerId]) return;

  peers[peerId].connection.addIceCandidate(RTCIceCandidate);
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
