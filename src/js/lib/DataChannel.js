import EventTarget from './EventTarget.js';

export default class DataChannel extends EventTarget {
  constructor() {
    super();

    this.peers = {};

    this.newPeer = {
      connection: null,
      channel: null,
      data: null,
    };

    this.RTCPeerConnectionOptions = { iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }] };
    this.RTCDataChannelOptions = { ordered: false, maxPacketLifeTime: 1000 };

    this.signalingServer = io.connect('/');
    window.signalingServer = this.signalingServer;

    this.setSignalingSocketEventHandlers();
  }

  setSignalingSocketEventHandlers = () => {
    this.signalingServer.addEventListener('connect', this.onConnection);
    this.signalingServer.addEventListener('peerIce', this.onPeerIce);
    this.signalingServer.addEventListener('peerAnswer', this.onPeerAnswer);
    this.signalingServer.addEventListener('peerOffer', this.onPeerOffer);
    this.signalingServer.addEventListener('peerWantsACall', this.onPeerWantsACall);
    this.signalingServer.addEventListener('peerUpdate', this.onPeerUpdate);
    this.signalingServer.addEventListener('peerDisconnect', this.onPeerDisconnect);
    this.signalingServer.addEventListener('signalingServerMessage', this.onSignalingServerMessage);
  };

  sendMessage = (label, ...input) => {
    const data = input.length === 1 ? input[0] : input;
    const peerKeys = Object.keys(this.peers);

    peerKeys.forEach(peerId => {
      if (!this.peers[peerId].channel) return;
      if (this.peers[peerId].channel.readyState !== 'open') return;

      const message = JSON.stringify({ label, data });
      this.peers[peerId].channel.send(message);
    });
  };

  get peerCount() {
    return Object.keys(this.peers).length || 0;
  }

  onConnection = () => {
    console.log(this.signalingServer.id);
  };

  onPeerIce = (peerId, RTCIceCandidate) => {
    if (!RTCIceCandidate.candidate) return;
    if (!this.peers[peerId]) return;

    this.peers[peerId].connection.addIceCandidate(RTCIceCandidate);
  };

  onPeerAnswer = (peerId, RemoteRTCSessionDescription) => {
    if (!this.peers[peerId]) return;

    this.peers[peerId].connection.setRemoteDescription(RemoteRTCSessionDescription);
  };

  onPeerOffer = (peerId, RemoteRTCSessionDescription) => {
    // if there is no peer yet, create an empty one
    if (!this.peers[peerId]) this.peers[peerId] = { ...this.newPeer };

    // else if the peer did exists
    // check if there is no connection yet
    // the peer object might exists since we can get 'userUpdate' before 'peerOffer'
    // if we find a connection, then the connection is already setup. so we won't need
    // to create a new one
    if (this.peers[peerId].connection) return;

    const Peer = this.peers[peerId];

    Peer.connection = new RTCPeerConnection(this.RTCPeerConnectionOptions, null);

    Peer.connection
      .setRemoteDescription(RemoteRTCSessionDescription)
      .then(() => Peer.connection.createAnswer())
      .then(LocalRTCSessionDescription => {
        Peer.connection.setLocalDescription(LocalRTCSessionDescription);
        this.signalingServer.emit('peerAnswer', peerId, LocalRTCSessionDescription);
      })
      .catch(() => {
        this.dispatchEvent(
          new CustomEvent('connectionError', {
            detail: { message: 'Failed to connect to another users' },
          }),
        );
      });

    Peer.connection.addEventListener('icecandidate', RTCPeerConnectionIceEvent => {
      if (!RTCPeerConnectionIceEvent.candidate) return;

      this.signalingServer.emit('peerIce', peerId, RTCPeerConnectionIceEvent.candidate);
    });

    Peer.connection.addEventListener('datachannel', RTCDataChannelEvent => {
      if (!RTCDataChannelEvent.channel) return;

      Peer.channel = RTCDataChannelEvent.channel;

      Peer.channel.addEventListener('open', () => {
        Peer.channel.addEventListener('message', this.onMessage);
      });

      Peer.channel.addEventListener('close', () => {});
    });
  };

  onPeerWantsACall = peerId => {
    if (this.peers[peerId]) return;

    this.peers[peerId] = { ...this.newPeer };
    const Peer = this.peers[peerId];

    Peer.connection = new RTCPeerConnection(this.RTCPeerConnectionOptions, null);

    Peer.channel = Peer.connection.createDataChannel('datachannel', this.RTCDataChannelOptions);

    Peer.connection.addEventListener('datachannel', event => {
      Peer.channel = event.channel;
    });

    Peer.connection.addEventListener('icecandidate', RTCPeerConnectionIceEvent => {
      if (!RTCPeerConnectionIceEvent.candidate) return;

      this.signalingServer.emit('peerIce', peerId, RTCPeerConnectionIceEvent.candidate);
    });

    Peer.connection.addEventListener('negotiationneeded', () => {
      Peer.connection
        .createOffer()
        .then(LocalRTCSessionDescription => {
          Peer.connection.setLocalDescription(LocalRTCSessionDescription);
          this.signalingServer.emit('peerOffer', peerId, LocalRTCSessionDescription);
        })
        .catch(() => {
          this.dispatchEvent(
            new CustomEvent('connectionError', {
              detail: { message: 'Failed to connect to another users' },
            }),
          );
        });
    });

    Peer.channel.addEventListener('open', () => {
      this.dispatchEvent(
        new CustomEvent('dataChannelMessage', {
          detail: { action: 'peerConnect', peerId },
        }),
      );

      Peer.channel.addEventListener('message', this.onMessage);
    });

    Peer.channel.addEventListener('close', () => {});
  };

  // eslint-disable-next-line class-methods-use-this
  onPeerUpdate = (peerId, data) => {
    // the peer might not exists yet becaouse 'peerUpdate' can occure before 'peerOffer'
    if (!this.peers[peerId]) this.peers[peerId] = { ...this.newPeer };

    const userData = JSON.parse(data);

    this.peers[peerId].data = {
      name: userData.name,
      uri: userData.uri,
    };

    this.dispatchEvent(
      new CustomEvent('peerUpdate', {
        detail: { peer: { id: peerId, name: userData.name, uri: userData.uri } },
      }),
    );
  };

  onPeerDisconnect = peerId => {
    if (!this.peers[peerId]) return;

    this.peers[peerId].channel.close();
    this.peers[peerId].connection.close();
    delete this.peers[peerId];

    this.dispatchEvent(
      new CustomEvent('dataChannelMessage', {
        detail: { action: 'peerDisconnect', peerId },
      }),
    );
  };

  onSignalingServerMessage = (label, data) => {
    //
    if (label === 'roomCreated') {
      this.dispatchEvent(
        new CustomEvent('roomSuccess', {
          detail: { action: 'created', room: { name: data } },
        }),
      );
    }

    if (label === 'roomJoined') {
      this.dispatchEvent(
        new CustomEvent('roomSuccess', {
          detail: { action: 'joined', room: data },
        }),
      );
    }

    if (label === 'roomOpened') {
      this.dispatchEvent(
        new CustomEvent('roomSuccess', {
          detail: { action: 'opened', room: { name: data } },
        }),
      );
    }

    if (label === 'roomFull') {
      this.dispatchEvent(
        new CustomEvent('dataChannelMessage', {
          detail: { action: 'roomFull' },
        }),
      );
    }

    if (label === 'roomError') {
      this.dispatchEvent(
        new CustomEvent('roomError', {
          detail: { message: data },
        }),
      );
    }
  };

  createRoom = () => {
    this.signalingServer.emit('createRoom');
  };

  joinRoom = roomName => {
    console.log('DataChannel: joinRoom', roomName);
    this.signalingServer.emit('joinRoom', roomName);
  };

  openRoom = (roomName, roomSize) => {
    this.signalingServer.emit('openRoom', roomName, roomSize);
  };

  roomFull = roomName => {
    this.signalingServer.emit('roomFull', roomName);
  };

  signalReady = (name, uri) => {
    this.signalingServer.emit('userReady', JSON.stringify({ name, uri }));
  };

  startGame = () => {
    //
  };
}
