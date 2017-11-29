(function () {
'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};









var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var EventTarget = function () {
  function EventTarget() {
    classCallCheck(this, EventTarget);

    this.listeners = {};
  }

  EventTarget.prototype.addEventListener = function addEventListener(type, callback) {
    if (!(type in this.listeners)) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
  };

  EventTarget.prototype.removeEventListener = function removeEventListener(type, callback) {
    if (!(type in this.listeners)) return;

    var stack = this.listeners[type];
    for (var i = 0, l = stack.length; i < l; i += 1) {
      if (stack[i] === callback) {
        stack.splice(i, 1);
        return;
      }
    }
  };

  EventTarget.prototype.dispatchEvent = function dispatchEvent(event) {
    if (!(event.type in this.listeners)) return true;

    var stack = this.listeners[event.type];
    for (var i = 0, l = stack.length; i < l; i += 1) {
      stack[i].call(this, event);
    }
    return !event.defaultPrevented;
  };

  EventTarget.prototype.on = function on(type, callback) {
    return this.addEventListener(type, callback);
  };

  return EventTarget;
}();

var DataChannel = function (_EventTarget) {
  inherits(DataChannel, _EventTarget);

  function DataChannel() {
    classCallCheck(this, DataChannel);

    var _this = possibleConstructorReturn(this, _EventTarget.call(this));

    _this.peers = {};

    _this.newPeer = {
      connection: null,
      channel: null,
      data: null
    };

    _this.RTCPeerConnectionOptions = { iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }] };
    _this.RTCDataChannelOptions = { ordered: false, maxPacketLifeTime: 1000 };

    _this.signalingServer = io.connect('/');

    _this.bindClassMethods();
    _this.setEventListeners();
    return _this;
  }

  DataChannel.prototype.bindClassMethods = function bindClassMethods() {
    // eslint-disable-next-line no-restricted-syntax
    for (var method in this) {
      if (typeof this[method] === 'function') {
        this[method] = this[method].bind(this);
      }
    }
  };

  DataChannel.prototype.setEventListeners = function setEventListeners() {
    this.signalingServer.on('connect', this.onConnection);
    this.signalingServer.on('peerIce', this.onPeerIce);
    this.signalingServer.on('peerAnswer', this.onPeerAnswer);
    this.signalingServer.on('peerOffer', this.onPeerOffer);
    this.signalingServer.on('peerWantsACall', this.onPeerWantsACall);
    this.signalingServer.on('peerUpdate', this.onPeerUpdate);
    this.signalingServer.on('peerDisconnect', this.onPeerDisconnect);
    this.signalingServer.on('signalingServerMessage', this.onSignalingServerMessage);
  };

  DataChannel.prototype.sendMessage = function sendMessage(label) {
    var _this2 = this;

    for (var _len = arguments.length, input = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      input[_key - 1] = arguments[_key];
    }

    var data = input.length === 1 ? input[0] : input;
    var peerKeys = Object.keys(this.peers);

    peerKeys.forEach(function (peerId) {
      if (!_this2.peers[peerId].channel) return;
      if (_this2.peers[peerId].channel.readyState !== 'open') return;

      var message = JSON.stringify({ label: label, data: data });
      _this2.peers[peerId].channel.send(message);
    });
  };

  DataChannel.prototype.onConnection = function onConnection() {
    console.log(this.signalingServer.id);
  };

  DataChannel.prototype.onPeerIce = function onPeerIce(peerId, RTCIceCandidate) {
    if (!RTCIceCandidate.candidate) return;
    if (!this.peers[peerId]) return;

    this.peers[peerId].connection.addIceCandidate(RTCIceCandidate);
  };

  DataChannel.prototype.onPeerAnswer = function onPeerAnswer(peerId, RemoteRTCSessionDescription) {
    if (!this.peers[peerId]) return;

    this.peers[peerId].connection.setRemoteDescription(RemoteRTCSessionDescription);
  };

  DataChannel.prototype.onPeerOffer = function onPeerOffer(peerId, RemoteRTCSessionDescription) {
    var _this3 = this;

    // if there is no peer yet, create an empty one
    if (!this.peers[peerId]) this.peers[peerId] = _extends({}, this.newPeer);

    // else if the peer did exists
    // check if there is no connection yet
    // the peer object might exists since we can get 'userUpdate' before 'peerOffer'
    // if we find a connection, then the connection is already setup. so we won't need
    // to create a new one
    if (this.peers[peerId].connection) return;

    var Peer = this.peers[peerId];

    Peer.connection = new RTCPeerConnection(this.RTCPeerConnectionOptions, null);

    Peer.connection.setRemoteDescription(RemoteRTCSessionDescription).then(function () {
      return Peer.connection.createAnswer();
    }).then(function (LocalRTCSessionDescription) {
      Peer.connection.setLocalDescription(LocalRTCSessionDescription);
      _this3.signalingServer.emit('peerAnswer', peerId, LocalRTCSessionDescription);
    }).catch(function () {
      _this3.dispatchEvent(new CustomEvent('connectionError', {
        detail: { message: 'Failed to connect to another users' }
      }));
    });

    Peer.connection.addEventListener('icecandidate', function (RTCPeerConnectionIceEvent) {
      if (!RTCPeerConnectionIceEvent.candidate) return;

      _this3.signalingServer.emit('peerIce', peerId, RTCPeerConnectionIceEvent.candidate);
    });

    Peer.connection.addEventListener('datachannel', function (RTCDataChannelEvent) {
      if (!RTCDataChannelEvent.channel) return;

      Peer.channel = RTCDataChannelEvent.channel;

      Peer.channel.addEventListener('open', function () {
        _this3.dispatchEvent(new CustomEvent('dataChannelStateChange', {
          detail: { state: 'open', connection: { peerId: peerId } }
        }));

        Peer.channel.addEventListener('message', _this3.onMessage);
      });

      Peer.channel.addEventListener('close', function () {
        _this3.dispatchEvent(new CustomEvent('dataChannelStateChange', {
          detail: { state: 'close', connection: { peerId: peerId } }
        }));
      });
    });
  };

  DataChannel.prototype.onPeerWantsACall = function onPeerWantsACall(peerId) {
    var _this4 = this;

    if (this.peers[peerId]) return;

    this.peers[peerId] = _extends({}, this.newPeer);
    var Peer = this.peers[peerId];

    Peer.connection = new RTCPeerConnection(this.RTCPeerConnectionOptions, null);

    Peer.channel = Peer.connection.createDataChannel('datachannel', this.RTCDataChannelOptions);

    Peer.connection.addEventListener('datachannel', function (event) {
      Peer.channel = event.channel;
    });

    Peer.connection.addEventListener('icecandidate', function (RTCPeerConnectionIceEvent) {
      if (!RTCPeerConnectionIceEvent.candidate) return;

      _this4.signalingServer.emit('peerIce', peerId, RTCPeerConnectionIceEvent.candidate);
    });

    Peer.connection.addEventListener('negotiationneeded', function () {
      Peer.connection.createOffer().then(function (LocalRTCSessionDescription) {
        Peer.connection.setLocalDescription(LocalRTCSessionDescription);
        _this4.signalingServer.emit('peerOffer', peerId, LocalRTCSessionDescription);
      }).catch(function () {
        _this4.dispatchEvent(new CustomEvent('connectionError', {
          detail: { message: 'Failed to connect to another users' }
        }));
      });
    });

    Peer.channel.addEventListener('open', function () {
      _this4.dispatchEvent(new CustomEvent('dataChannelStateChange', {
        detail: { state: 'open', connection: { peerId: peerId } }
      }));

      Peer.channel.addEventListener('message', _this4.onMessage);
    });

    Peer.channel.addEventListener('close', function () {
      _this4.dispatchEvent(new CustomEvent('dataChannelStateChange', {
        detail: { state: 'close', connection: { peerId: peerId } }
      }));
    });
  };

  // eslint-disable-next-line class-methods-use-this


  DataChannel.prototype.onPeerUpdate = function onPeerUpdate(peerId, data) {
    // the peer might not exists yet becaouse 'peerUpdate' can occure before 'peerOffer'
    if (!this.peers[peerId]) this.peers[peerId] = _extends({}, this.newPeer);

    var userData = JSON.parse(data);

    this.peers[peerId].data = {
      name: userData.name,
      uri: userData.uri
    };

    this.dispatchEvent(new CustomEvent('peerUpdate', {
      detail: { peer: { id: peerId, name: userData.name, uri: userData.uri } }
    }));
  };

  DataChannel.prototype.onMessage = function onMessage(MessageEvent) {
    var _JSON$parse = JSON.parse(MessageEvent.data),
        label = _JSON$parse.label,
        data = _JSON$parse.data;

    if (label === 'userdata') this.onPeerUserData(data);
    if (label === 'message') {
      this.dispatchEvent(new Event('message', { bubbles: false, cancelable: false }));
    }
  };

  DataChannel.prototype.onPeerDisconnect = function onPeerDisconnect(peerId) {
    if (!this.peers[peerId]) return;

    this.peers[peerId].channel.close();
    this.peers[peerId].connection.close();
    delete this.peers[peerId];
  };

  DataChannel.prototype.onSignalingServerMessage = function onSignalingServerMessage(label, data) {
    //
    console.log(label, data);

    if (label === 'roomCreated') {
      this.dispatchEvent(new CustomEvent('roomSuccess', {
        detail: { action: 'created', room: { name: data } }
      }));
    }

    if (label === 'roomJoined') {
      this.dispatchEvent(new CustomEvent('roomSuccess', {
        detail: { action: 'joined', room: { name: data } }
      }));
    }

    if (label === 'roomError') {
      this.dispatchEvent(new CustomEvent('roomError', {
        detail: { message: data }
      }));
    }
  };

  DataChannel.prototype.createRoom = function createRoom() {
    this.signalingServer.emit('createRoom');
  };

  DataChannel.prototype.joinRoom = function joinRoom(roomName) {
    this.signalingServer.emit('joinRoom', roomName);
  };

  DataChannel.prototype.signalReady = function signalReady(name, uri) {
    this.signalingServer.emit('userReady', JSON.stringify({ name: name, uri: uri }));
  };

  return DataChannel;
}(EventTarget);

var thumbDataURI = (function (image) {
  var dSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    var img = new Image();
    var canvas = document.createElement('canvas');
    canvas.width = dSize;
    canvas.height = dSize;
    reader.addEventListener('load', function () {
      img.addEventListener('load', function () {
        if (img.width === img.height) {
          canvas.getContext('2d').drawImage(img, 0, 0, dSize, dSize);
        } else {
          canvas.getContext('2d').drawImage(img, img.width > img.height ? (img.width - img.height) / 2 : 0, img.width > img.height ? 0 : (img.height - img.width) / 2, img.width > img.height ? img.height : img.width, img.width > img.height ? img.height : img.width, 0, 0, dSize, dSize);
        }
        resolve(canvas.toDataURL());
      });
      img.addEventListener('error', reject);
      img.src = reader.result;
    });
    reader.addEventListener('error', reject);
    reader.readAsDataURL(image);
  });
});

var datachannel = null;

var $buttonCreateRoom = document.querySelector('.button_create-room');
var $targetRoomName = document.querySelector('.target_room-name');
var $inputRoomName = document.querySelector('.input_room-name');
var $buttonJoinRoom = document.querySelector('.button_join-room');

var $inputUserName = document.querySelector('.input_user-name');
var $inputUserPicture = document.querySelector('.input_user-picture');
var $readyButton = document.querySelector('.button_ready');

var log = {
  blue: function blue(l) {
    var _console;

    for (var _len = arguments.length, d = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      d[_key - 1] = arguments[_key];
    }

    return (_console = console).log.apply(_console, ['%c ' + l + ' ', 'background:#1e90ff;color:#ff711e'].concat(d));
  },
  red: function red(l) {
    var _console2;

    for (var _len2 = arguments.length, d = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      d[_key2 - 1] = arguments[_key2];
    }

    return (_console2 = console).log.apply(_console2, ['%c ' + l + ' ', 'background:#ff0000;color:#00ff00'].concat(d));
  },
  green: function green(l) {
    var _console3;

    for (var _len3 = arguments.length, d = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      d[_key3 - 1] = arguments[_key3];
    }

    return (_console3 = console).log.apply(_console3, ['%c ' + l + ' ', 'background:yellowgreen;color:white'].concat(d));
  },
  orange: function orange(l) {
    var _console4;

    for (var _len4 = arguments.length, d = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      d[_key4 - 1] = arguments[_key4];
    }

    return (_console4 = console).log.apply(_console4, ['%c ' + l + ' ', 'background:orange;color:white'].concat(d));
  }
};

var onRoomError = function onRoomError(event) {
  log.orange('WARN', event.detail.message);
};

var onRoomSuccess = function onRoomSuccess(event) {
  var action = event.detail.action === 'created' ? 'created and joined' : 'joined';
  var name = event.detail.room.name;

  if (event.detail.action === 'created') {
    $targetRoomName.textContent = name;
  }

  $inputRoomName.disabled = true;
  $buttonCreateRoom.disabled = true;
  $buttonJoinRoom.disabled = true;

  log.blue('LOG', 'Successfully ' + action + ' the "' + name + '" room');
};

var onStateChange = function onStateChange(event) {
  var state = event.detail.state;
  var peerId = event.detail.connection.peerId;

  if (state === 'open') log.green('CONNECTION', 'established with ' + peerId);
  if (state === 'close') log.red('DISCONNECTION', 'from ' + peerId);
};

var onPeerUpdate = function onPeerUpdate(event) {
  log.blue('LOG', 'got update from peer ' + event.detail.peer.id + ' name: ' + event.detail.peer.name);
};

var onReady = function onReady() {
  var name = $inputUserName.value;
  var picture = $inputUserPicture.files[0];

  if (!name || name === '' || !picture) return;

  thumbDataURI(picture).then(function (uri) {
    return datachannel.signalReady(name, uri);
  });
};

var onJoinRoom = function onJoinRoom() {
  var roomName = $inputRoomName.value;
  if (!roomName || roomName === '') return;
  datachannel.joinRoom(roomName);
};

var onKeyDown = function onKeyDown(event) {
  if (event.keyCode !== 13) return;
  onJoinRoom();
};

var initDataChannel = function initDataChannel() {
  datachannel = new DataChannel();

  $buttonJoinRoom.addEventListener('click', onJoinRoom);
  $inputRoomName.addEventListener('keydown', onKeyDown);
  $buttonCreateRoom.addEventListener('click', datachannel.createRoom);
  $readyButton.addEventListener('click', onReady);

  datachannel.on('roomError', onRoomError);
  datachannel.on('roomSuccess', onRoomSuccess);
  datachannel.on('dataChannelStateChange', onStateChange);
  datachannel.on('peerUpdate', onPeerUpdate);
};

var init = function init() {
  initDataChannel();

  window.peers = datachannel.peers;
  window.send = datachannel.sendMessage;
};

init();

}());
//# sourceMappingURL=index.js.map
