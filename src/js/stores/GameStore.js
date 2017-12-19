import { observable, computed, action } from 'mobx';

import EventTarget from './../classes/EventTarget.js';
import Peer from './../models/Peer.js';

import map from './../functions/map.js';
import wait from './../functions/wait.js';

export default class GameStore extends EventTarget {
  @observable renderBall = false;
  @observable renderPeerBall = false;
  @observable renderThrowButton = false;
  @observable renderDirectionIndicator = false;
  @observable renderConeIndicators = false;

  @observable playerCanThrow = false;
  @observable currentPlayingPeerNumber = 1;
  @observable currentPlayerId = null;

  @observable ballDirection;
  @observable coneIndicators;
  @observable cones;
  @observable me;
  @observable scores;
  @observable peers;

  constructor(dataChannel) {
    super();

    this.dataChannel = dataChannel;
    this.dataChannel
      .on('ssPeerData', this.onSSPeerData)
      .on('rtcPeerDisconnect', this.onRTCPeerDisconnect)
      .on('rtcPeerMessage', this.onRTCPeerMessage)
      .on('ssRoomUsersReady', this.onSSRoomUsersReady);

    this.currentShot = 1;
    this.hitCones = [];

    this.soundCanPlay = true;
    this.$conesHitSound = document.getElementById('cones-hit-sound');

    this.peers = new Map();

    this.scores = {
      one: '-',
      two: '-',
      current: 0,
      total: 0,
      tempTotal: 0,
    };

    this.cones = [
      { id: 1, position: '0 -2 -29', rendered: false },
      { id: 2, position: '.5 -2 -32', rendered: false },
      { id: 3, position: '-.5 -2 -32', rendered: false },
      { id: 4, position: '1 -2 -35', rendered: false },
      { id: 5, position: '0 -2 -35', rendered: false },
      { id: 6, position: '-1 -2 -35', rendered: false },
      { id: 7, position: '1.5 -2 -38', rendered: false },
      { id: 8, position: '.5 -2 -38', rendered: false },
      { id: 9, position: '-.5 -2 -38', rendered: false },
      { id: 10, position: '-1.5 -2 -38', rendered: false },
    ];

    this.coneIndicators = [
      { id: 1, position: '4.0 -0.05 -3.75', hit: false },
      { id: 2, position: '4.1 0.10 -3.75', hit: false },
      { id: 3, position: '3.9 0.10 -3.75', hit: false },
      { id: 4, position: '4.2 0.25 -3.75', hit: false },
      { id: 5, position: '4.0 0.25 -3.75', hit: false },
      { id: 6, position: '3.8 0.25 -3.75', hit: false },
      { id: 7, position: '4.3 0.40 -3.75', hit: false },
      { id: 8, position: '4.1 0.40 -3.75', hit: false },
      { id: 9, position: '3.9 0.40 -3.75', hit: false },
      { id: 10, position: '3.7 0.40 -3.75', hit: false },
    ];

    this.peerPositions = [
      { ball: '-5.3 .5 6.5', score: '-5.3 2.5 6.5', crown: '-5.3 1.2 6.5' },
      { ball: '-5.3 .5 9', score: '-5.3 2.5 9', crown: '-5.3 1.2 9' },
      { ball: '5.3 .5 9', score: '5.3 2.5 9', crown: '5.3 1.2 9' },
      { ball: '5.3 .5 6.5', score: '5.3 2.5 6.5', crown: '5.3 1.2 6.5' },
    ];

    this.roomSize = -1;
    this.listenToCollisions = false;
  }

  @computed
  get shotOne() {
    return this.currentShot === 1;
  }

  @computed
  get strike() {
    return this.shotOne && this.scores.current === 10;
  }

  @computed
  get peersArray() {
    const array = [];
    for (const [, peer] of this.peers) {
      array.push(peer);
    }
    return array;
  }

  @computed
  get currentPlayer() {
    for (const [, peer] of this.peers) {
      if (peer.order === this.currentPlayingPeerNumber) {
        return peer;
      }
    }
    return -1;
  }

  @computed
  get currentLeaders() {
    const peers = [];
    for (const [, peer] of this.peers) {
      peers.push(peer);
    }

    peers.push(this.me);

    const { score: leaderScore } = peers.reduce(
      (prev, current) => (prev.score > current.score ? prev : current),
    );

    if (leaderScore === 0) return [];

    // return an array with all the id's of peers with the leaderScore (in case of multiple same scores)
    return peers.filter(peer => peer.score === leaderScore).map(peer => peer.id);
  }

  @computed
  get renderedCones() {
    return this.cones.filter(cone => cone.rendered === true);
  }

  @computed
  get currentPlayingPlayer() {
    for (const [, peer] of this.peers) {
      if (peer.order === this.currentPlayingPeerNumber) {
        return peer;
      }
    }
    return null;
  }

  get imTheCurrentPlayer() {
    return this.me.order === this.currentPlayingPeerNumber;
  }

  onSSRoomUsersReady = event => {
    this.roomSize = event.detail.roomSize;
  };

  getPeerIdByOrder = order => {
    for (const [, peer] of this.peers) {
      if (peer.order === order) {
        return peer.id;
      }
    }
    return null;
  };

  goToNextPlayer = () => {
    this.nextPeerNumber();
    this.dataChannel.sendMessage('nextpeer');
    this.resetConesAndIndicators();
  };

  nextPeerNumber = () => {
    if (this.currentPlayingPeerNumber < this.roomSize) {
      this.currentPlayingPeerNumber += 1;
    } else {
      this.currentPlayingPeerNumber = 1;
    }
  };

  @action
  onSSPeerData = event => {
    const peerData = event.detail;
    const {
      id, name, uri, order,
    } = peerData;

    if (peerData.me) {
      // it's me

      this.me = new Peer('me', name, uri, order);
    } else {
      // it's a friend

      const positions = this.peerPositions[this.peers.size];
      const { ball: ballPosition, score: scorePosition, crown: crownPosition } = positions;

      const peer = new Peer(id, name, uri, order, ballPosition, scorePosition, crownPosition);
      this.peers.set(id, peer);
    }
  };

  @action
  onRTCPeerDisconnect = event => {
    this.peers.delete(event.detail.id);
  };

  @action
  onRTCMessagePeerBallThrow = message => {
    console.log('ball throw from ', message.peerId);
    this.peerThrowBall(message.data.direction);
  };

  @action
  onRTCMessagePeerScoreUpdate = message => {
    const peer = this.peers.get(message.peerId);
    if (!peer) return;

    peer.setScore(message.data.score);
  };

  @action
  onRTCPeerMessage = event => {
    const message = event.detail;

    if (message.label === 'peerBallThrow') this.onRTCMessagePeerBallThrow(message);
    if (message.label === 'peerScoreUpdate') this.onRTCMessagePeerScoreUpdate(message);
    if (message.label === 'nextpeer') this.onRTCMessageNextPeer();
  };

  @action
  onRTCMessageNextPeer() {
    this.nextPeerNumber();

    // play frame if i'm the next player
    if (this.currentPlayingPeerNumber === this.me.order) {
      this.startFrame();
    } else {
      this.resetConesAndIndicators();
    }
  }

  @action
  updateScores = score => {
    this.scores.current = score;

    if (this.strike) {
      this.scores.one = 'X';
      this.scores.two = score;
    } else if (this.currentShot === 1) {
      this.scores.one = score;
    } else {
      this.scores.two = score;
    }

    this.scores.total = this.scores.tempTotal + score;

    this.me.setScore(this.scores.total);

    this.dataChannel.sendMessage('peerScoreUpdate', {
      score: this.scores.total,
    });
  };

  @action
  updateDirectionIndicatorValue = direction => {
    this.diractionIndicatorPosition = direction;
  };

  @action
  collisionHandler = event => {
    if (!this.listenToCollisions) return;

    // if the hit id is a cone
    const hitConeId = parseInt(event.detail.body.el.id, 10);
    if (!hitConeId) return;

    const indicator = this.coneIndicators.find(i => i.id === hitConeId);
    if (!indicator.hit) {
      indicator.hit = true;
      this.hitCones.push(hitConeId);
    }

    if (this.soundCanPlay) {
      this.$conesHitSound.play();
      this.soundCanPlay = false;
    }

    // update score if i'm the current player.
    // not if it's an other peer playing
    if (this.imTheCurrentPlayer) {
      this.updateScores(this.hitCones.length);
    }
  };

  @action
  removeHitCones = () => {
    console.log('remove hit cones');

    this.hitCones.forEach(id => {
      this.cones.find(c => c.id === id).rendered = false;
    });
    this.hitCones = [];
  };

  @action
  resetConesAndIndicators = () => {
    console.log('reset cones and indicators');

    wait(500, () => {
      this.cones.forEach(cone => (cone.rendered = true));
      this.coneIndicators.forEach(indicator => (indicator.hit = false));
    });
  };

  @action
  throwComplete = () => {
    this.listenToCollisions = false;
    this.renderConeIndicators = false;
    this.soundCanPlay = true;
    this.scores.tempTotal += this.scores.current;

    this.removeHitCones();

    if (this.imTheCurrentPlayer) {
      // if im the one who throw the ball

      this.renderBall = false;

      if (this.strike) {
        this.endFrame();
      } else if (this.shotOne) {
        this.renderThrowButton = true;
        this.renderDirectionIndicator = true;
        this.renderConeIndicators = true;

        this.playerCanThrow = true;
        this.currentShot += 1;

        if (this.scores.one === '-') this.scores.one = 0;
      } else {
        if (this.scores.two === '-') this.scores.two = 0;
        this.endFrame();
      }
    } else {
      // if it's a peer who threw the ball

      console.log('set render peer ball to false');
      this.currentPlayerId = null;
      this.renderPeerBall = false;
    }
  };

  @action
  throwBall = () => {
    if (!this.playerCanThrow) return;

    this.renderBall = true;

    this.ballDirection = map(this.diractionIndicatorPosition, -1.45, 1.22, -3.45, 3.22);

    this.renderThrowButton = false;
    this.renderDirectionIndicator = false;

    this.dataChannel.sendMessage('peerBallThrow', {
      direction: this.ballDirection,
    });

    this.playerCanThrow = false;

    wait(500, () => (this.listenToCollisions = true));
    wait(4000, this.throwComplete);
  };

  @action
  peerThrowBall = direction => {
    console.log(`thow peer ball to ${direction}`);

    this.currentPlayerId = this.currentPlayingPlayer.id;
    this.renderPeerBall = true;

    this.renderConeIndicators = true;

    this.peerBallDirection = direction;

    wait(500, () => (this.listenToCollisions = true));
    wait(4000, this.throwComplete);
  };

  @action
  startFrame = () => {
    this.currentShot = 1;

    this.cones.forEach(cone => (cone.rendered = true));
    this.coneIndicators.forEach(indicator => (indicator.hit = false));

    this.renderThrowButton = true;
    this.renderDirectionIndicator = true;
    this.renderConeIndicators = true;

    this.playerCanThrow = true;

    // reset scores
    this.scores.one = '-';
    this.scores.two = '-';
  };

  @action
  endFrame = () => {
    console.log('end frame');

    this.scores.current = 0;
    this.currentShot = 1;
    this.playerCanThrow = false;

    this.cones.forEach(cone => (cone.rendered = false));
    this.coneIndicators.forEach(indicator => (indicator.hit = false));

    this.goToNextPlayer();
  };

  init = () => {
    // start frame if i'm the current player
    if (this.me.order === 1) {
      this.startFrame();
    } else {
      console.log('someone else has to start');
    }
  };
}
