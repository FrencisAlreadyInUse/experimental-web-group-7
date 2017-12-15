import { observable } from 'mobx';

import EventTarget from './EventTarget.js';

export default class DataChannel extends EventTarget {
  constructor() {
    super();

    this.users = observable(new Map());
    this.me = observable({
      name: 'anonymous',
      uri: null,
    });
    this.peers = {};

    this.newPeerTemplate = {
      connection: null,
      channel: null,
    };

    this.RTCPeerConnectionOptions = {
      iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }],
    };

    this.RTCDataChannelOptions = {
      ordered: false,
      maxPacketLifeTime: 1000,
    };

    this.signalingServer = io.connect('/');

    if (process.env.NODE_ENV === 'development') {
      window.signalingServer = this.signalingServer;
    }

    this.setSignalingSocketEventHandlers();
  }

  setSignalingSocketEventHandlers = () => {
    this.signalingServer
      .on('connect', this.onConnection)
      .on('peerIce', this.onPeerIce)
      .on('peerAnswer', this.onPeerAnswer)
      .on('peerOffer', this.onPeerOffer)
      .on('peerWantsACall', this.onPeerWantsACall)
      .on('peerUpdate', this.onPeerUpdate)
      .on('peerDisconnect', this.onPeerDisconnect)
      .on('signalingServerMessage', this.onSignalingServerMessage);
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
    if (!this.peers[peerId]) {
      // if there is no peer yet, create an empty one
      this.peers[peerId] = { ...this.newPeerTemplate };
    } else if (this.peers[peerId].connection) {
      // else if the peer did exists
      // check if there is no connection yet
      // the peer object might exists since we can get 'userUpdate' before 'peerOffer'
      // if we find a connection, then the connection is already setup. so we won't need
      // to create a new one
      return;
    }

    const Peer = this.peers[peerId];

    /* create a new peer connection */
    Peer.connection = new RTCPeerConnection(this.RTCPeerConnectionOptions, null);

    /* create answer description */
    Peer.connection
      .setRemoteDescription(RemoteRTCSessionDescription)
      .then(() => Peer.connection.createAnswer())
      .then(LocalRTCSessionDescription => {
        /* set local description */
        Peer.connection.setLocalDescription(LocalRTCSessionDescription);

        /* sending answer description to peer */
        this.signalingServer.emit('peerAnswer', peerId, LocalRTCSessionDescription);
      })
      .catch(() => {
        this.dispatchEvent(
          new CustomEvent('connectionError', {
            detail: { message: 'Failed to connect to another users' },
          }),
        );
      });

    /* on ice candidate */
    Peer.connection.addEventListener('icecandidate', RTCPeerConnectionIceEvent => {
      if (!RTCPeerConnectionIceEvent.candidate) return;

      /* send ice candidate to peer */
      this.signalingServer.emit('peerIce', peerId, RTCPeerConnectionIceEvent.candidate);
    });

    /* on data channel */
    Peer.connection.addEventListener('datachannel', RTCDataChannelEvent => {
      if (!RTCDataChannelEvent.channel) return;

      /* set data channel */
      Peer.channel = RTCDataChannelEvent.channel;

      /* handle channel opening */
      Peer.channel.addEventListener('open', () => {
        /* listen to messages from other peer */
        Peer.channel.addEventListener('message', this.onMessage);
      });

      /* handle channel closing */
      Peer.channel.addEventListener('close', () => {
        console.log(peerId, 'data channel closes');
      });
    });
  };

  onPeerWantsACall = peerId => {
    if (this.peers[peerId]) return;

    this.peers[peerId] = { ...this.newPeerTemplate };
    const Peer = this.peers[peerId];

    /* create a new peer connection */
    Peer.connection = new RTCPeerConnection(this.RTCPeerConnectionOptions, null);

    /* create the data channel */
    Peer.channel = Peer.connection.createDataChannel('datachannel', this.RTCDataChannelOptions);

    /* on data channel */
    Peer.connection.addEventListener('datachannel', RTCDataChannelEvent => {
      if (!RTCDataChannelEvent.channel) return;

      /* set data channel */
      Peer.channel = RTCDataChannelEvent.channel;
    });

    /* on ice candidate */
    Peer.connection.addEventListener('icecandidate', RTCPeerConnectionIceEvent => {
      if (!RTCPeerConnectionIceEvent.candidate) return;

      /* send ice candidate to peer */
      this.signalingServer.emit('peerIce', peerId, RTCPeerConnectionIceEvent.candidate);
    });

    /* negotiation needed */
    Peer.connection.addEventListener('negotiationneeded', () => {
      /* create offer description */
      Peer.connection
        .createOffer()
        .then(LocalRTCSessionDescription => {
          /* set local description */
          Peer.connection.setLocalDescription(LocalRTCSessionDescription);

          /* send offer description to peer */
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

    /* handle data channel opening */
    Peer.channel.addEventListener('open', () => {
      this.dispatchEvent(
        new CustomEvent('dataChannelMessage', {
          detail: { action: 'peerConnect', peerId },
        }),
      );

      Peer.channel.addEventListener('message', this.onMessage);
    });

    /* handle data channel closing */
    Peer.channel.addEventListener('close', () => {
      console.log(peerId, 'data channel closes');
    });
  };

  onPeerUpdate = (peerId, data) => {
    /* the peer might not exists yet becaouse 'peerUpdate' can occure before 'peerOffer' */
    if (!this.peers[peerId]) {
      /* create the user */
      this.peers[peerId] = { ...this.newPeerTemplate };
    }

    const userData = JSON.parse(data);

    this.users.set(peerId, {
      name: userData.name,
      uri: userData.uri,
    });
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

    if (label === 'allUsersReady') {
      this.dispatchEvent(new CustomEvent('startGame', { detail: null }));
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
    this.me.name = name;
    this.me.uri = uri;

    this.signalingServer.emit('userReady', JSON.stringify({ name, uri }));
  };
}
