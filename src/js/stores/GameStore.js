import { observable, action } from 'mobx';

import EventTarget from './../classes/EventTarget.js';
import map from './../functions/map.js';
import wait from './../functions/wait.js';

export default class GameStore extends EventTarget {
  //
  @observable renderBall = false;
  @observable renderCones = false;
  @observable renderThrowButton = false;
  @observable renderDirectionIndicator = false;

  @observable playerCanThrow = false;
  @observable ballDirection = 0.2;

  @observable
  coneIndicators = [
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

  @observable
  cones = [
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

  @observable
  me = {
    name: 'anonymous',
    uri: null,
  };

  @observable
  scores = {
    one: '-',
    two: '-',
    current: 0,
    total: 0,
    tempTotal: 0,
  };

  constructor(dataChannel) {
    super();

    this.dataChannel = dataChannel;
    this.dataChannel.on('dataChannelPeerData', this.peerDataUpdate);

    this.currentFrame = 1;
    this.currentShot = 1;
    this.hitCones = [];

    this.soundCanPlay = true;
    this.$conesHitSound = document.getElementById('cones-hit-sound');
  }

  @action
  peerDataUpdate = event => {
    const { peer } = event.detail;
    console.log(peer);
  }

  @action
  updateScores = score => {
    this.scores.current = score;

    if (this.currentShot === 1) {
      this.scores.one = score;
    } else {
      this.scores.two = score;
    }

    this.scores.total = this.scores.tempTotal + score;
  };

  @action
  updateDirectionIndicatorValue = direction => {
    this.diractionIndicatorPosition = direction;
  };

  @action
  collisionHandler = event => {
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

    this.updateScores(this.hitCones.length);
  };

  @action
  removeHitCones = () => {
    this.hitCones.forEach(id => {
      const cone = this.cones.find(c => c.id === id);
      if (cone && cone.rendered) {
        cone.rendered = false;
      }
    });
    this.hitCones = [];
  };

  @action
  resetCones = (showCones = false) => {
    this.renderCones = showCones;

    this.cones.forEach(cone => {
      cone.rendered = true;
    });
  };

  @action
  endFrame = () => {
    console.log('end frame');

    this.resetCones(false);
  };

  @action
  throwComplete = () => {
    this.dispatchEvent(new Event('removeCollisionDetection'));

    this.renderBall = false;
    this.scores.tempTotal += this.scores.current;
    this.soundCanPlay = true;

    this.removeHitCones();

    // if this was the first shot AND we didn't throw a strike
    if (this.currentShot === 1 && this.scores.current < 10) {
      //
      this.renderThrowButton = true;
      this.renderDirectionIndicator = true;
      this.playerCanThrow = true;

      this.currentShot += 1;
    } else if (this.scores.current === 10) {
      //
      this.scores.two = 'X';
      this.endFrame();
    } else {
      //
      this.endFrame();
    }
  };

  @action
  throwBall = () => {
    if (!this.playerCanThrow) return;

    this.ballDirection = map(this.diractionIndicatorPosition, -1.45, 1.22, -3.45, 3.22);
    this.renderBall = true;
    this.renderThrowButton = false;
    this.renderDirectionIndicator = false;

    this.playerCanThrow = false;

    this.dispatchEvent(new Event('addCollisionDetection'));

    wait(4000, this.throwComplete);
  };

  @action
  startFrame = () => {
    this.renderCones = true;
    this.renderThrowButton = true;
    this.renderDirectionIndicator = true;

    this.playerCanThrow = true;
  };

  init = () => {
    this.startFrame();
  };
}
