import EventTarget from './EventTarget.js';

export default class DataChannel extends EventTarget {
  constructor() {
    super();

    this.peers = {};

    this.newRTCPeerTemplate = {
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

    this.signalingServer
      .on('connect', this.onSSConnect)

      .on('peerIce', this.onSSPeerIce)
      .on('peerAnswer', this.onSSPeerAnswer)
      .on('peerOffer', this.onSSPeerOffer)
      .on('peerWantsACall', this.onSSPeerWantsCall)
      .on('peerUpdate', this.onSSPeerUpdate)
      .on('peerDisconnect', this.onSSPeerDisconnect)

      .on('roomError', this.onSSRoomError)
      .on('roomFull', this.onSSRoomFull)
      .on('roomUsersReady', this.onSSRoomUsersReady)
      .on('roomCreated', this.onSSRoomCreated)
      .on('roomJoined', this.onSSRoomJoined)
      .on('roomOpened', this.onSSRoomOpened);
  }

  sendMessage = (label, message) => {
    console.log('[sendMessage]', label, message);
    const peerKeys = Object.keys(this.peers);

    peerKeys.forEach(peerId => {
      if (!this.peers[peerId].channel) return;
      if (this.peers[peerId].channel.readyState !== 'open') return;

      this.peers[peerId].channel.send(JSON.stringify({ label, peerId: this.myId, message }));
    });
  };

  onMessage = MessageEvent => {
    console.log('[onMessage]', MessageEvent);
    const data = JSON.parse(MessageEvent.data);

    console.log('[onMessage]', data);

    this.dispatchEvent(
      new CustomEvent('rtcPeerMessage', {
        detail: data,
      }),
    );
  };

  onSSConnect = () => {
    this.myId = this.signalingServer.id;
    console.log('[onSSConnect]', this.myId);
    this.dispatchEvent(new CustomEvent('dcSocketConnection'));
  };

  onSSPeerIce = (peerId, RTCIceCandidate) => {
    console.log('[onSSPeerIce]', peerId, RTCIceCandidate);
    if (!RTCIceCandidate.candidate) return;
    if (!this.peers[peerId]) return;

    this.peers[peerId].connection.addIceCandidate(RTCIceCandidate);
  };

  onSSPeerAnswer = (peerId, RemoteRTCSessionDescription) => {
    console.log('[onSSPeerAnswer]', peerId, RemoteRTCSessionDescription);
    if (!this.peers[peerId]) return;

    this.peers[peerId].connection.setRemoteDescription(RemoteRTCSessionDescription);
  };

  onSSPeerOffer = (peerId, RemoteRTCSessionDescription) => {
    console.log('[onSSPeerOffer]', peerId, RemoteRTCSessionDescription);
    if (!this.peers[peerId]) {
      // if there is no peer yet, create an empty one
      this.peers[peerId] = { ...this.newRTCPeerTemplate };

      this.dispatchEvent(
        new CustomEvent('ssPeerData', {
          detail: { id: peerId },
        }),
      );
    } else if (this.peers[peerId].connection) {
      // else if the peer did exists
      // check if there is no connection yet
      // the peer object might exists since we can get 'userUpdate' before 'peerOffer'
      // if we find a connection, then the connection is already setup. so we won't need
      // to create a new one
      return;
    }

    const PEER = this.peers[peerId];
    console.log('[PEER]', PEER);

    /* create a new peer connection */
    PEER.connection = new RTCPeerConnection(this.RTCPeerConnectionOptions, null);

    /* create answer description */
    PEER.connection
      .setRemoteDescription(RemoteRTCSessionDescription)
      .then(() => PEER.connection.createAnswer())
      .then(LocalRTCSessionDescription => {
        /* set local description */
        PEER.connection.setLocalDescription(LocalRTCSessionDescription);

        /* sending answer description to peer */
        this.signalingServer.emit('peerAnswer', peerId, LocalRTCSessionDescription);
      })
      .catch(() => {
        this.dispatchEvent(
          new ErrorEvent('dcError', {
            message: 'Failed to connect to another users',
            filename: 'DataChannel.js',
          }),
        );
      });

    /* on ice candidate */
    PEER.connection.addEventListener('icecandidate', RTCPeerConnectionIceEvent => {
      if (!RTCPeerConnectionIceEvent.candidate) return;

      /* send ice candidate to peer */
      this.signalingServer.emit('peerIce', peerId, RTCPeerConnectionIceEvent.candidate);
    });

    /* on data channel */
    PEER.connection.addEventListener('datachannel', RTCDataChannelEvent => {
      if (!RTCDataChannelEvent.channel) return;

      /* set data channel */
      PEER.channel = RTCDataChannelEvent.channel;

      /* handle channel opening */
      PEER.channel.addEventListener('open', () => {
        /* listen to messages from other peer */
        PEER.channel.addEventListener('message', this.onMessage);
      });

      /* handle channel closing */
      PEER.channel.addEventListener('close', () => {
        console.log(peerId, 'closed');
      });
    });
  };

  onSSPeerWantsCall = peerId => {
    console.log('[onSSPeerWantsCall]', peerId);
    if (this.peers[peerId]) return;

    this.peers[peerId] = { ...this.newRTCPeerTemplate };
    const PEER = this.peers[peerId];

    this.dispatchEvent(
      new CustomEvent('ssPeerData', {
        detail: { id: peerId },
      }),
    );

    /* create a new peer connection */
    PEER.connection = new RTCPeerConnection(this.RTCPeerConnectionOptions, null);

    /* create the data channel */
    PEER.channel = PEER.connection.createDataChannel('datachannel', this.RTCDataChannelOptions);

    /* on data channel */
    PEER.connection.addEventListener('datachannel', RTCDataChannelEvent => {
      if (!RTCDataChannelEvent.channel) return;

      /* set data channel */
      PEER.channel = RTCDataChannelEvent.channel;
    });

    /* on ice candidate */
    PEER.connection.addEventListener('icecandidate', RTCPeerConnectionIceEvent => {
      if (!RTCPeerConnectionIceEvent.candidate) return;

      /* send ice candidate to peer */
      this.signalingServer.emit('peerIce', peerId, RTCPeerConnectionIceEvent.candidate);
    });

    /* negotiation needed */
    PEER.connection.addEventListener('negotiationneeded', () => {
      /* create offer description */
      PEER.connection
        .createOffer()
        .then(LocalRTCSessionDescription => {
          /* set local description */
          PEER.connection.setLocalDescription(LocalRTCSessionDescription);

          /* send offer description to peer */
          this.signalingServer.emit('peerOffer', peerId, LocalRTCSessionDescription);
        })
        .catch(() => {
          this.dispatchEvent(
            new ErrorEvent('dcError', {
              message: 'Failed to connect to another users',
              filename: 'DataChannel.js',
            }),
          );
        });
    });

    /* handle data channel opening */
    PEER.channel.addEventListener('open', () => {
      this.dispatchEvent(new CustomEvent('rtcPeerConnect'));

      PEER.channel.addEventListener('message', this.onMessage);
    });

    /* handle data channel closing */
    PEER.channel.addEventListener('close', () => {
      console.log(peerId, 'closed');
    });
  };

  onSSPeerUpdate = (peerId, data) => {
    console.log('[onSSPeerUpdate]', peerId, data);
    /* the peer might not exists yet becaouse 'peerUpdate' can occure before 'peerOffer' */
    if (!this.peers[peerId]) {
      /* create the user */
      this.peers[peerId] = { ...this.newRTCPeerTemplate };
    }

    const { name, uri } = JSON.parse(data);

    this.dispatchEvent(
      new CustomEvent('ssPeerData', {
        detail: { id: peerId, name, uri },
      }),
    );
  };

  onSSPeerDisconnect = peerId => {
    console.log('[onSSPeerDisconnect]', peerId);
    if (!this.peers[peerId]) return;

    this.peers[peerId].channel.close();
    this.peers[peerId].connection.close();
    delete this.peers[peerId];

    this.dispatchEvent(
      new CustomEvent('rtcPeerDisconnect', {
        detail: { id: peerId },
      }),
    );
  };

  onSSRoomError = data => {
    console.log('[onSSRoomError]', data);
    this.dispatchEvent(
      new ErrorEvent('ssError', {
        message: data,
        filename: 'DataChannel.js',
      }),
    );
  };

  onSSRoomCreated = room => {
    console.log('[onSSRoomCreated]', room);
    this.dispatchEvent(
      new CustomEvent('ssRoomCreated', {
        detail: room.name,
      }),
    );
  };

  onSSRoomJoined = room => {
    console.log('[onSSRoomJoined]', room);
    this.dispatchEvent(
      new CustomEvent('ssRoomJoined', {
        detail: room.name,
      }),
    );
  };

  onSSRoomOpened = room => {
    console.log('[onSSRoomOpened]', room);
    this.dispatchEvent(
      new CustomEvent('ssRoomOpened', {
        detail: room.name,
      }),
    );
  };

  onSSRoomFull = () => {
    console.log('[onSSRoomFull]');
    this.dispatchEvent(new Event('ssRoomFull'));
  };

  onSSRoomUsersReady = () => {
    console.log('[onSSRoomUsersReady]');
    this.dispatchEvent(new Event('ssRoomUsersReady'));
  };

  createRoom = () => {
    console.log('[createRoom] — emit createRoom');
    this.signalingServer.emit('createRoom');
  };

  joinRoom = roomName => {
    console.log('[joinRoom]', roomName);
    this.signalingServer.emit('joinRoom', roomName);
  };

  openRoom = (roomName, roomSize) => {
    console.log('[openRoom]', roomName, roomSize);
    this.signalingServer.emit('openRoom', roomName, roomSize);
  };

  roomFull = roomName => {
    console.log('[roomFull]', roomName);
    this.signalingServer.emit('roomFull', roomName);
  };

  userReady = (name, uri) => {
    console.log('[userReady]', name, uri);
    this.dispatchEvent(new CustomEvent('ssPeerData', { detail: { me: true, name, uri } }));

    this.signalingServer.emit('userReady', JSON.stringify({ name, uri }));
  };
}
