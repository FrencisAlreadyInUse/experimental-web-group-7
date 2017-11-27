import 'webrtc-adapter';

export default class RTC {
  constructor(options) {
    this.requestConnectionButton = options.requestConnectionButton;
    this.createRoomButton = options.createRoomButton;

    this.receiveMessageHandler = options.receiveMessageHandler;

    this.peers = {};

    this.RTCPeerConnectionOptions = { iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }] };
    this.RTCDataChannelOptions = { ordered: false, maxPacketLifeTime: 1000 };

    this.signalingServer = io.connect('/');

    this.bindEventHandlers.bind(this)();
    this.setEventListeners();
  }

  bindEventHandlers() {
    this.sendMessage = this.sendMessage.bind(this);

    this.onConnection = this.onConnection.bind(this);
    this.onPeerIce = this.onPeerIce.bind(this);
    this.onPeerAnswer = this.onPeerAnswer.bind(this);
    this.onPeerOffer = this.onPeerOffer.bind(this);
    this.onPeerWantsACall = this.onPeerWantsACall.bind(this);
    this.onPeerDisconnect = this.onPeerDisconnect.bind(this);
    this.onRoomCreated = this.onRoomCreated.bind(this);
    this.onSignalingServerMessage = this.onSignalingServerMessage.bind(this);

    this.askConnection = this.askConnection.bind(this);
    this.createRoom = this.createRoom.bind(this);
  }

  setEventListeners() {
    this.signalingServer.addEventListener('connect', this.onConnection);
    this.signalingServer.addEventListener('peerIce', this.onPeerIce);
    this.signalingServer.addEventListener('peerAnswer', this.onPeerAnswer);
    this.signalingServer.addEventListener('peerOffer', this.onPeerOffer);
    this.signalingServer.addEventListener('peerWantsACall', this.onPeerWantsACall);
    this.signalingServer.addEventListener('peerDisconnect', this.onPeerDisconnect);
    this.signalingServer.addEventListener('roomCreated', this.onRoomCreated);
    this.signalingServer.addEventListener('signalingServerMessage', this.onSignalingServerMessage);

    this.requestConnectionButton.addEventListener('click', this.askConnection);
    this.createRoomButton.addEventListener('click', this.createRoom);
  }

  sendMessage(...data) {
    const peerKeys = Object.keys(this.peers);

    peerKeys.forEach((peerId) => {
      if (!this.peers[peerId].channel) return;
      if (this.peers[peerId].channel.readyState !== 'open') return;

      this.peers[peerId].channel.send(...data);
    });
  }

  onConnection() {
    console.log(this.signalingServer.id);
  }

  onPeerIce(peerId, RTCIceCandidate) {
    if (!RTCIceCandidate.candidate) return;
    if (!this.peers[peerId]) return;

    this.peers[peerId].connection.addIceCandidate(RTCIceCandidate);
  }

  onPeerAnswer(peerId, RemoteRTCSessionDescription) {
    if (!this.peers[peerId]) return;

    this.peers[peerId].connection.setRemoteDescription(RemoteRTCSessionDescription);
  }

  onPeerOffer(peerId, RemoteRTCSessionDescription) {
    if (this.peers[peerId]) return;

    this.peers[peerId] = { connection: null, channel: null };
    const Peer = this.peers[peerId];

    Peer.connection = new RTCPeerConnection(this.RTCPeerConnectionOptions, null);

    Peer.connection
      .setRemoteDescription(RemoteRTCSessionDescription)
      .then(() => Peer.connection.createAnswer())
      .then((LocalRTCSessionDescription) => {
        Peer.connection.setLocalDescription(LocalRTCSessionDescription);
        this.signalingServer.emit('peerAnswer', peerId, LocalRTCSessionDescription);
      })
      .catch(console.error);

    Peer.connection.addEventListener('icecandidate', (RTCPeerConnectionIceEvent) => {
      if (!RTCPeerConnectionIceEvent.candidate) return;

      this.signalingServer.emit('peerIce', peerId, RTCPeerConnectionIceEvent.candidate);
    });

    Peer.connection.addEventListener('datachannel', (RTCDataChannelEvent) => {
      if (!RTCDataChannelEvent.channel) return;

      Peer.channel = RTCDataChannelEvent.channel;

      Peer.channel.addEventListener('open', () => {
        Peer.channel.addEventListener('message', MessageEvent =>
          this.receiveMessageHandler(MessageEvent.data));
      });

      // Peer.channel.addEventListener('close', null);
    });
  }

  onPeerWantsACall(peerId) {
    if (this.peers[peerId]) return;

    this.peers[peerId] = { connection: null, channel: null };
    const Peer = this.peers[peerId];

    Peer.connection = new RTCPeerConnection(this.RTCPeerConnectionOptions, null);

    Peer.channel = Peer.connection.createDataChannel('datachannel', this.RTCDataChannelOptions);

    Peer.connection.addEventListener('datachannel', (event) => {
      Peer.channel = event.channel;
    });

    Peer.connection.addEventListener('icecandidate', (RTCPeerConnectionIceEvent) => {
      if (!RTCPeerConnectionIceEvent.candidate) return;

      this.signalingServer.emit('peerIce', peerId, RTCPeerConnectionIceEvent.candidate);
    });

    Peer.connection.addEventListener('negotiationneeded', () => {
      Peer.connection
        .createOffer()
        .then((LocalRTCSessionDescription) => {
          Peer.connection.setLocalDescription(LocalRTCSessionDescription);
          this.signalingServer.emit('peerOffer', peerId, LocalRTCSessionDescription);
        })
        .catch(console.error);
    });

    Peer.channel.addEventListener('open', () => {
      Peer.channel.addEventListener('message', MessageEvent =>
        this.receiveMessageHandler(MessageEvent.data));
    });

    // Peer.channel.addEventListener('close', null);
  }

  onPeerDisconnect(peerId) {
    console.log('onPeerDisconnect');

    if (!this.peers[peerId]) return;

    console.log('%c BEYBEY ', 'background: orange; color: white', peerId);

    this.peers[peerId].channel.close();
    this.peers[peerId].connection.close();
    delete this.peers[peerId];
  }

  // eslint-disable-next-line
  onRoomCreated(roomName) {
    console.log(roomName);
  }

  // eslint-disable-next-line
  onSignalingServerMessage(message) {
    console.log(message);
  }

  askConnection() {
    this.signalingServer.emit('peerWantsACall');
  }

  createRoom() {
    this.signalingServer.emit('createRoom');
  }
}
