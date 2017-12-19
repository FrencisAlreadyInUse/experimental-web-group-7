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
  // @observable renderConeIndicators = false;

  @observable playerCanThrow = false;
  @observable currentPlayingPeerNumber = 1;
  @observable currentPlayerId = null;
  @observable currentPlayerName = 'Japser Best Dev';

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

    this.currentTry = 1;
    this.hitCones = new Set();

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
      { id: 1, position: '0 -2 -29', rendered: true },
      { id: 2, position: '.5 -2 -32', rendered: true },
      { id: 3, position: '-.5 -2 -32', rendered: true },
      { id: 4, position: '1 -2 -35', rendered: true },
      { id: 5, position: '0 -2 -35', rendered: true },
      { id: 6, position: '-1 -2 -35', rendered: true },
      { id: 7, position: '1.5 -2 -38', rendered: true },
      { id: 8, position: '.5 -2 -38', rendered: true },
      { id: 9, position: '-.5 -2 -38', rendered: true },
      { id: 10, position: '-1.5 -2 -38', rendered: true },
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
  get tryOne() {
    return this.currentTry === 1;
  }

  @computed
  get strike() {
    return this.tryOne && this.scores.current === 10;
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
  get currentLeaders() {
    const peers = [];
    for (const [, peer] of this.peers) {
      peers.push(peer);
    }

    peers.push(this.me);

    const { score: leaderScore } = peers.reduce(
      (prev, current) => (prev.score > current.score ? prev : current),
    );

    // return empty array if top score is 0
    if (leaderScore === 0) return [];

    // return an array with all the id's of peers with the leaderScore (in case of multiple same scores)
    return peers.filter(peer => peer.score === leaderScore).map(peer => peer.id);
  }

  @computed
  get renderedCones() {
    return this.cones.filter(cone => cone.rendered === true);
  }

  @computed
  get imTheCurrentPlayer() {
    return this.me.order === this.currentPlayingPeerNumber;
  }

  @action
  onSSRoomUsersReady = event => {
    this.roomSize = event.detail.roomSize;
  };

  @action
  getPeerIdByOrder = order => {
    for (const [, peer] of this.peers) {
      if (peer.order === order) {
        return peer.id;
      }
    }
    return null;
  };

  @action
  goToNextPlayer = () => {
    this.nextCurrentPlayingPeerNumber();
    this.dataChannel.sendMessage('nextpeer');
  };

  @action
  nextCurrentPlayingPeerNumber = () => {
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

    this.currentPlayerId = message.peerId;
    console.log(this.currentPlayerId);
    this.startThrow(message.data.direction);
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
    if (message.label === 'peerIndicatorUpdate') this.onRTCMessagePeerIndicatorUpdate(message);
    if (message.label === 'nextpeer') this.onRTCMessageNextPeer();
  };

  @action
  onRTCMessagePeerIndicatorUpdate = message => {
    console.log('peer indicator update');
    const hitConeId = message.data.coneId;

    this.updateIndicatorAndAddConeToHitCones(hitConeId);
  };

  @action
  onRTCMessageNextPeer = () => {
    this.resetCones();
    this.resetIndicators();
    this.nextCurrentPlayingPeerNumber();

    // play frame if i'm the next player
    if (this.currentPlayingPeerNumber === this.me.order) {
      console.log('next plater, its me!');
      this.startFrame();
    } else {
      console.log('next player');
    }
  };

  @action
  updateScores = score => {
    this.scores.current = score;
    console.log('score', this.scores.current);

    if (this.strike) {
      this.scores.one = 'X';
      this.scores.two = score;
    } else if (this.currentTry === 1) {
      this.scores.one = score;
    } else {
      const scoreTwo = score - this.scores.one;
      this.scores.two = scoreTwo !== 0 ? scoreTwo : '-';
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

    if (this.imTheCurrentPlayer) {
      this.updateScores(this.hitCones.size);

      if (this.soundCanPlay) {
        this.$conesHitSound.play();
        this.soundCanPlay = false;
      }

      this.updateIndicatorAndAddConeToHitCones(hitConeId);

      this.dataChannel.sendMessage('peerIndicatorUpdate', {
        coneId: hitConeId,
      });
    }
  };

  @action
  updateIndicatorAndAddConeToHitCones = hitConeId => {
    this.coneIndicators.find(i => i.id === hitConeId).hit = true;
    this.hitCones.add(hitConeId);
  };

  @action
  removeHitCones = () => {
    console.log('remove hit cones');

    for (const hitConeId of this.hitCones) {
      console.log('remove cone', hitConeId);
      this.cones.find(c => c.id === hitConeId).rendered = false;
    }
    this.hitCones.clear();
  };

  @action
  resetIndicators = () => {
    console.log('reset indicators');

    this.coneIndicators.forEach(indicator => (indicator.hit = false));
  };

  @action
  resetCones = () => {
    console.log('reset cones');

    for (const hitConeId of this.hitCones) {
      console.log('reloaded hit cone', hitConeId);

      this.cones.find(cone => cone.id === hitConeId).rendered = false;
      wait(0, () => {
        this.cones.find(cone => cone.id === hitConeId).rendered = true;
        this.hitCones.delete(hitConeId);
      });
    }
  };

  @action
  startThrow = (direction = null) => {
    if (this.imTheCurrentPlayer && !this.playerCanThrow) return;

    this.playerCanThrow = false;

    console.log('start throw', direction);

    wait(500, () => (this.listenToCollisions = true));
    wait(4000, this.endThrow);

    this.ballDirection =
      direction || map(this.diractionIndicatorPosition, -1.45, 1.22, -3.45, 3.22);

    if (this.imTheCurrentPlayer) {
      console.log('i threw the ball');

      this.renderBall = true;
      this.renderThrowButton = false;
      this.renderDirectionIndicator = false;

      // notify peers i threw my ball (sorry for the dirty sentence)
      this.dataChannel.sendMessage('peerBallThrow', {
        direction: this.ballDirection,
      });
    } else {
      console.log('a peer threw the ball');
      this.renderPeerBall = true;
    }
  };

  @action
  endThrow = () => {
    console.log('end throw');

    this.endTry();

    this.listenToCollisions = false;
    this.soundCanPlay = true;
    this.scores.tempTotal += this.scores.current;

    if (this.imTheCurrentPlayer) {
      this.renderBall = false;

      if (this.strike) {
        this.endFrame();
      } else if (this.tryOne) {
        this.currentTry = 2;
        if (this.scores.one === '-') this.scores.one = 0;
        this.startTry();
      } else {
        if (this.scores.two === '-') this.scores.two = 0;
        this.endFrame();
      }
    } else {
      this.currentPlayerId = null;
      this.renderPeerBall = false;
    }
  };

  @action
  startTry = () => {
    console.log('start try');

    this.renderThrowButton = true;
    this.renderDirectionIndicator = true;
    this.playerCanThrow = true;
  };

  @action
  endTry = () => {
    console.log('end try');

    for (const hitConeId of this.hitCones) {
      this.cones.find(cone => cone.id === hitConeId).rendered = false;
    }
  };

  @action
  startFrame = () => {
    console.log('start frame');

    this.scores.current = 0;

    this.currentTry = 1;
    this.scores.one = '-';
    this.scores.two = '-';

    this.startTry();
  };

  @action
  endFrame = () => {
    console.log('end frame');

    this.scores.current = 0;

    this.resetCones();
    this.resetIndicators();
    this.goToNextPlayer();
  };

  init = () => {
    console.log('init');

    // start frame if i'm the current player
    if (this.imTheCurrentPlayer) {
      this.startFrame();
    }
  };
}
