import Cone from './nodes/Cone.js';
import Ball from './nodes/Ball.js';
import AssetItem from './nodes/AssetItem.js';
import User from './nodes/User.js';
import map from './../functions/map.js';

export default class Game {
  constructor(dataChannel) {
    this.dataChannel = dataChannel;

    /* add a listener to changes that occure to the datachannel users map */
    this.dataChannel.users.observe(this.dataChannelUserObserverListener);

    this.uniqueHits = new Set();
    this.sliderPosition = 0;
    this.currentFrame = 1;
    this.currentThrow = 1;
    this.currentThrowScore = 0;
    this.totalThrowScore = 0;
    this.playerCanThrow = false;
    this.playedSound = false;

    this.initializeDOMElements();

    this.$conesHitSound.volume = 0.35;
    this.$aframeScene.addEventListener('loaded', this.handleLoadedScene);
  }

  initializeDOMElements = () => {
    this.$ball = null;

    this.$aframeScene = document.querySelector('a-scene');
    this.$aframeAssets = document.getElementById('assets');

    this.$button = document.getElementById('start-button');
    this.$indicatorSlider = document.getElementById('ball-pos');
    this.$coneIndicators = document.querySelectorAll('.cone-indicator');
    this.$throwButton = document.querySelectorAll('.throw-message');
    this.$firstThrow = document.getElementById('first-throw');
    this.$secondThrow = document.getElementById('second-throw');
    this.$totalScore = document.getElementById('total-score');
    this.$conesHitSound = document.getElementById('cones-hit-sound');
  };

  dataChannelUserObserverListener = change => {
    if (change.type === 'add') {
      this.addFaceBallAsset(change);
      this.addFaceBallUser(change);
    }
  };

  addFaceBallAsset = change => {
    const id = `face-ball-${change.name}`;
    const src = change.newValue.uri;

    const $asset = new AssetItem({ id, src });
    this.$aframeAssets.appendChild($asset);
  };

  addFaceBallUser = change => {
    const userCount = this.dataChannel.users.size;
    const src = `#face-ball-${change.name}`;

    const $user = new User(userCount, { src });
    this.$aframeScene.appendChild($user);
  };

  setAttributeMultiple = ($nodes, attribute, value) => {
    Array.from($nodes).forEach($node => {
      $node.setAttribute(attribute, value);
    });
  };

  setScoreValue = ($node, value) => {
    $node.setAttribute('text', `width:6; align:center; value: ${value}`);
  };

  setScoring = score => {
    //
    this.currentThrowScore = score;

    if (this.currentThrow === 1) {
      this.setScoreValue(this.$firstThrow, score);
    }
    if (this.currentThrow === 2) {
      this.setScoreValue(this.$secondThrow, score);
    }

    this.setScoreValue(this.$totalScore, this.totalThrowScore + score);
  };

  resetDisplayScores = () => {
    this.setScoreValue(this.$firstThrow, '-');
    this.setScoreValue(this.$secondThrow, '-');
  };

  handleConeCollosion = e => {
    const hit = parseInt(e.detail.body.el.id, 10);
    if (isNaN(hit)) return;

    if (this.uniqueHits) this.uniqueHits.add(hit);
    else this.uniqueHits = new Set([hit]);

    this.uniqueHits.forEach(id => {
      const $indicator = document.querySelector(`.cone-indicator[data-id='${id}']`);
      if ($indicator) {
        $indicator.setAttribute('color', 'red');
      }

      if (!this.playedSound) {
        this.$conesHitSound.play();
        this.playedSound = true;
      }

      this.setScoring(this.uniqueHits.size);
    });
  };

  getAttributes = () => {
    this.sliderPosition = this.$indicatorSlider.getAttribute('position');
    requestAnimationFrame(this.getAttributes);
  };

  removeBallFromScene = () => {
    if (this.$ball) {
      this.$aframeScene.removeChild(this.$ball);
      this.$ball = null;
    }
  };

  removeConesFromScene = (all = false) => {
    /* remove all cones fro scene */
    if (all) {
      Array.from(document.querySelectorAll('.cone')).forEach($cone =>
        this.$aframeScene.removeChild($cone),
      );

      return;
    }

    /* remove only hit cones from scene */
    if (this.uniqueHits) {
      this.uniqueHits.forEach(id => {
        this.$aframeScene.removeChild(document.getElementById(id));
        this.uniqueHits.delete(id);
      });
      this.uniqueHits.clear();
    }
  };

  createCone = (position, index) => new Cone({ id: index + 1, position });

  generateCones = () => {
    const coneData = [
      '0 -2 -29',
      '.5 -2 -32',
      '-.5 -2 -32',
      '1 -2 -35',
      '0 -2 -35',
      '-1 -2 -35',
      '1.5 -2 -38',
      '.5 -2 -38',
      '-.5 -2 -38',
      '-1.5 -2 -38',
    ];

    const $fragment = new DocumentFragment();
    coneData.map(this.createCone).forEach($cone => $fragment.appendChild($cone));

    this.$aframeScene.appendChild($fragment);
  };

  resetConeIndicators = () => {
    this.$coneIndicators.forEach(indicator => {
      indicator.setAttribute('color', 'white');
    });
  };

  endFrame = () => {
    this.playerCanThrow = false;
    this.currentThrow = 1;
    this.playedSound = false;

    this.uniqueHits.clear();

    this.setAttributeMultiple(this.$throwButton, 'opacity', 0);

    this.removeBallFromScene();
    this.removeConesFromScene(true);

    this.resetDisplayScores();
    this.resetConeIndicators();

    this.generateCones();

    this.currentFrame += 1;
  };

  firstThrowCallback = () => {
    this.removeBallFromScene();
    this.removeConesFromScene();

    if (this.currentThrowScore < 10) {
      this.playerCanThrow = true;
      this.currentThrow += 1;

      /* show throw button */
      this.setAttributeMultiple(this.$throwButton, 'opacity', 1);
    } else {
      /* we threw a strike, next player's turn */
      this.endFrame();
    }
  };

  secondThrowCallback = () => {
    this.endFrame();
  };

  endOfThrowCallback = () => {
    this.playedSound = false;
    this.totalThrowScore += this.currentThrowScore;

    if (this.currentThrow === 1) {
      this.firstThrowCallback();
    } else if (this.currentThrow === 2) {
      this.secondThrowCallback();
    }
  };

  generateBall = pos => {
    this.$ball = new Ball({ position: `${pos} -1.25 -10` });
    this.$ball.addEventListener('collide', this.handleConeCollosion);

    this.$aframeScene.appendChild(this.$ball);

    this.playerCanThrow = false;

    /* hide throw button */
    this.setAttributeMultiple(this.$throwButton, 'opacity', 0);

    /* wait for throw to "complete" */
    setTimeout(this.endOfThrowCallback, 3000);
  };

  handleThrowBall = () => {
    /* add hit collision to cones */
    Array.from(document.querySelectorAll('.cone')).forEach($cone => {
      $cone.addEventListener('collide', this.handleConeCollosion);
    });

    if (this.playerCanThrow) {
      const position = map(this.sliderPosition.x, -1.45, 1.22, -3.45, 3.22);
      this.generateBall(position);
    }
  };

  startFrame = (init = false) => {
    this.playerCanThrow = true;
    this.setAttributeMultiple(this.$throwButton, 'opacity', 1);

    if (init) {
      this.$button.addEventListener('click', this.handleThrowBall);
    }
  };

  generateScene = () => {
    this.getAttributes();
    this.generateCones();
  };

  handleLoadedScene = () => {
    console.log('scene loaded');

    this.generateScene();
    this.startFrame(true);
  };
}
