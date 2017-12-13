import Cone from './lib/Objects/Cone.js';
import Ball from './lib/Objects/Ball.js';
import map from './lib/map.js';

const $aframeScene = document.querySelector('a-scene');
const $button = document.getElementById('start-button');

const $indicatorSlider = document.getElementById('ball-pos');
let sliderPosition;

const $coneIndicators = document.querySelectorAll('.cone-indicator');

const $throwButton = document.querySelectorAll('.throw-message');
const $firstThrow = document.getElementById('first-throw');
const $secondThrow = document.getElementById('second-throw');
const $totalScore = document.getElementById('total-score');

const $conesHitSound = document.getElementById('cones-hit-sound');
$conesHitSound.volume = 0.35;

// const $strikeMessage = document.getElementById('strike-msg');
// const $strikeMessageAnimation = document.createElement('a-animation');

let $ball;

let uniqueHits;

let currentFrame = 1;
let currentThrow = 1;

let currentThrowScore = 0;
let totalThrowScore = 0;

let playerCanThrow = true;
let playedSound = false;

const setAttributeMultiple = ($nodes, attribute, value) => {
  Array.from($nodes).forEach($node => {
    $node.setAttribute(attribute, value);
  });
};

const setScoreValue = ($node, value) => {
  $node.setAttribute('text', `width:6; align:center; value: ${value}`);
};

const setScoring = score => {
  //
  currentThrowScore = score;

  if (currentThrow === 1) {
    setScoreValue($firstThrow, score);
  }
  if (currentThrow === 2) {
    setScoreValue($secondThrow, score);
  }

  setScoreValue($totalScore, totalThrowScore + score);
};

const resetDisplayScores = () => {
  setScoreValue($firstThrow, '-');
  setScoreValue($secondThrow, '-');
};

const handleConeCollosion = e => {
  const hit = parseInt(e.detail.body.el.id, 10);
  if (isNaN(hit)) return;

  if (uniqueHits) uniqueHits.add(hit);
  else uniqueHits = new Set([hit]);

  uniqueHits.forEach(id => {
    const $indicator = document.querySelector(`.cone-indicator[data-id='${id}`);
    if ($indicator) {
      $indicator.setAttribute('color', 'red');
    }

    if (!playedSound) {
      $conesHitSound.play();
      playedSound = true;
    }

    setScoring(uniqueHits.size);
  });
};

const getAttributes = () => {
  sliderPosition = $indicatorSlider.getAttribute('position');
  requestAnimationFrame(getAttributes);
};

const removeBallFromScene = () => {
  if ($ball) {
    $aframeScene.removeChild($ball);
    $ball = null;
  }
};

const removeConesFromScene = (all = false) => {
  /* remove all cones fro scene */
  if (all) {
    Array.from(document.querySelectorAll('.cone')).forEach($cone =>
      $aframeScene.removeChild($cone),
    );

    return;
  }

  /* remove only hit cones from scene */
  if (uniqueHits) {
    uniqueHits.forEach(id => {
      $aframeScene.removeChild(document.getElementById(id));
      uniqueHits.delete(id);
    });
    uniqueHits.clear();
  }
};

const createCone = (pos, index) => {
  const $cone = new Cone(index + 1, pos);
  $aframeScene.appendChild($cone);
};

const generateCones = () => {
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
  coneData.forEach(createCone);
};

const resetConeIndicators = () => {
  $coneIndicators.forEach(indicator => {
    indicator.setAttribute('color', 'white');
  });
};

const endFrame = () => {
  playerCanThrow = false;
  currentThrow = 1;
  playedSound = false;

  uniqueHits.clear();

  setAttributeMultiple($throwButton, 'opacity', 0);

  removeBallFromScene();
  removeConesFromScene(true);

  resetDisplayScores();
  resetConeIndicators();

  generateCones();

  currentFrame += 1;
};

const firstThrowCallback = () => {
  removeBallFromScene();
  removeConesFromScene();

  if (currentThrowScore < 10) {
    playerCanThrow = true;
    currentThrow += 1;

    /* show throw button */
    setAttributeMultiple($throwButton, 'opacity', 1);
  } else {
    /* we threw a strike, next player's turn */
    endFrame();
  }
};

const secondThrowCallback = () => {
  endFrame();
};

const endOfThrowCallback = () => {
  playedSound = false;
  totalThrowScore += currentThrowScore;

  if (currentThrow === 1) {
    firstThrowCallback();
  } else if (currentThrow === 2) {
    secondThrowCallback();
  }
};

const generateBall = targetPosition => {
  $ball = new Ball(targetPosition);
  $ball.addEventListener('collide', handleConeCollosion);

  $aframeScene.appendChild($ball);

  playerCanThrow = false;

  /* hide throw button */
  setAttributeMultiple($throwButton, 'opacity', 0);

  /* wait for throw to "complete" */
  setTimeout(endOfThrowCallback, 3000);
};

const handleThrowBall = () => {
  /* add hit collision to cones */

  Array.from(document.querySelectorAll('.cone')).forEach($cone => {
    $cone.addEventListener('collide', handleConeCollosion);
  });
  console.log('added hit collision');

  if (playerCanThrow) {
    const position = map(sliderPosition.x, -1.45, 1.22, -3.45, 3.22);
    generateBall(position);
  }
};

const startFrame = (init = false) => {
  playerCanThrow = true;
  setAttributeMultiple($throwButton, 'opacity', 1);

  if (init) {
    $button.addEventListener('click', handleThrowBall);
  }
};

const generateScene = () => {
  getAttributes();
  generateCones();
};

const handleLoadedScene = () => {
  console.log('scene loaded');

  generateScene();
  startFrame(true);
};

const init = () => {
  $aframeScene.addEventListener('loaded', handleLoadedScene);
  window.startFrame = startFrame;
};

init();
