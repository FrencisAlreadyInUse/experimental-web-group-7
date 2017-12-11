const $aframeScene = document.querySelector('a-scene');
const $button = document.getElementById('start-button');

const $indicatorSlider = document.getElementById('ball-pos');
let $currentSliderPosition;

const $cones = document.querySelectorAll('.cones');
const $coneIndicators = document.querySelectorAll('.cone-indicator');

const $throwMessage = document.querySelectorAll('.throw-message');
const $firstThrow = document.getElementById('first-throw');
const $secondThrow = document.getElementById('second-throw');
const $totalScore = document.getElementById('total-score');

const $conesHitSound = document.getElementById('cones-hit-sound');
$conesHitSound.volume = 0.35;

// const $strikeMessage = document.getElementById('strike-msg');
// const $strikeMessageAnimation = document.createElement('a-animation');

let uniqueHits;

let currentFrame = 1;
let currentThrow = 1;

let firstThrowScore = 0;
let currentThrowScore = 0;
let totalThrowScore = 0;

let canThrow = true;
let playedSound = false;

const setAttributeMultiple = ($nodes, attribute, value) => {
  Array.from($nodes).forEach($node => {
    $node.setAttribute(attribute, value);
  });
};

/* prettier-ignore */
const map = (value, start1, stop1, start2, stop2) =>
  start2 + ((stop2 - start2) * ((value - start1) / (stop1 - start1)));

const setScoreValue = ($node, value) => {
  $node.setAttribute('text', `width:6; align:center; value: ${value}`);
};

const setScoring = score => {
  // this is our first throw
  if (currentThrow === 1) {
    currentThrowScore = score;
    totalThrowScore = currentThrowScore;
    setScoreValue($firstThrow, score);

    if (score === 10) {
      setScoreValue($firstThrow, 'X');
      // $strikeMessage.setAttribute('visible', true);

      // $strikeMessageAnimation.setAttribute('attribute', 'position');
      // $strikeMessageAnimation.setAttribute('to', '-2.347 1.994 -8.793');
      // $strikeMessageAnimation.setAttribute('easing', 'ease-in-out');
      // $strikeMessageAnimation.setAttribute('fill', 'backwards');
      // $strikeMessageAnimation.setAttribute('direction', 'alternate');
      // $strikeMessageAnimation.setAttribute('delay', '1000');
      // $strikeMessageAnimation.setAttribute('dur', '1500');
      // $strikeMessage.appendChild($strikeMessageAnimation);
    } else setScoreValue($firstThrow, score);
  }

  // this is our second throw
  if (currentThrow === 2) {
    totalThrowScore = score + firstThrowScore;
    setScoreValue($secondThrow, score);
  }

  setScoreValue($totalScore, totalThrowScore);
};

const handleCollision = e => {
  console.log('[handleCollision]', 'I Got Called Again');
  const hit = parseInt(e.detail.body.el.id, 10);
  if (isNaN(hit)) return;

  if (uniqueHits) {
    uniqueHits.add(hit);
  } else {
    uniqueHits = new Set([hit]);
  }

  uniqueHits.forEach(id => {
    $coneIndicators.forEach(indicator => {
      if (parseInt(indicator.dataset.id, 10) === id) {
        if (!playedSound) $conesHitSound.play();
        playedSound = true;
        indicator.setAttribute('color', 'red');
        setScoring(uniqueHits.size);
      }
    });
  });
};

const getAttributes = () => {
  $currentSliderPosition = $indicatorSlider.getAttribute('position');
  requestAnimationFrame(getAttributes);
};

const generateScene = () => {
  getAttributes();
};

const removeBallAndHitCones = $ball => {
  if (uniqueHits) {
    uniqueHits.forEach(id => {
      $aframeScene.removeChild(document.getElementById(id));
      uniqueHits.delete(id);
    });

    uniqueHits.clear();
  }

  $aframeScene.removeChild($ball);
};

const generateCone = (id, pos) => {
  const $cone = document.createElement('a-collada-model');
  $cone.setAttribute('id', id);
  $cone.setAttribute('src', '#cone');
  $cone.setAttribute('position', pos);
  $cone.setAttribute('radius', '.75');
  $cone.setAttribute('dynamic-body', 'shape: box; mass: 1;');
  $aframeScene.appendChild($cone);
};

const regenerateCones = () => {
  //
  // only set new cones for hit ones
  //
  generateCone('1', '0 -2 -29');
  generateCone('2', '.5 -2 -32');
  generateCone('3', '-.5 -2 -32');
  generateCone('4', '1 -2 -35');
  generateCone('5', '0 -2 -35');
  generateCone('6', '-1 -2 -35');
  generateCone('7', '1.5 -2 -38');
  generateCone('8', '.5 -2 -38');
  generateCone('9', '-.5 -2 -38');
  generateCone('10', '-1.5 -2 -38');
};

const resetSceneForNextPlayer = () => {
  console.log('[resetSceneForNextPlayer] — I Got Called');
  canThrow = true;
  currentThrow = 1;
  firstThrowScore = 0;
  currentThrowScore = 0;
  playedSound = false;
  uniqueHits = '';
  setAttributeMultiple($throwMessage, 'opacity', 1);
  regenerateCones();
};

const endOfThrowCallback = $ball => {
  removeBallAndHitCones($ball);
  playedSound = false;

  // we will go to throw nr 2 here
  if (currentThrow === 1) {
    firstThrowScore = currentThrowScore;

    if (firstThrowScore < 10) {
      canThrow = true;
      currentThrow = 2;

      // ball is ready to be thrown again, show "throw" message
      setAttributeMultiple($throwMessage, 'opacity', 1);
    } else {
      // we threw a strike, next player's turn
      console.log("we threw a strike, next player's turn");
      resetSceneForNextPlayer();
    }
  } else if (currentThrow === 2) {
    // we did our nr 2 throw, next player's turn
    console.log('[currentThrow] — 2 // reset game after');
    currentFrame += 1;
    resetSceneForNextPlayer();
  }
};

const generateBall = targetPosition => {
  const $ball = document.createElement('a-sphere');
  $ball.setAttribute('id', 'bowlingBall');
  $ball.setAttribute('src', '#face-ball');
  $ball.setAttribute('position', `${targetPosition} -1.25 -10`);
  $ball.setAttribute('radius', '.75');
  $ball.setAttribute('dynamic-body', 'shape: sphere; sphereRadius: .77; mass: 50;');
  $ball.setAttribute('velocity', '0 0 -35');
  $aframeScene.appendChild($ball);

  $ball.addEventListener('collide', handleCollision);

  // ball was thrown, hide "throw" message
  setAttributeMultiple($throwMessage, 'opacity', 0);

  canThrow = false;
  setTimeout(() => endOfThrowCallback($ball), 3000);
};

const generateInteractiveScene = () => {
  Array.from($cones).forEach(cone => {
    cone.addEventListener('collide', handleCollision);
  });
  const position = map($currentSliderPosition.x, -1.45, 1.22, -3.45, 3.22);
  if (canThrow) generateBall(position);
};

const handleLoadedScene = () => {
  console.log('scene loaded');

  $button.addEventListener('click', generateInteractiveScene);
  generateScene();
};

const init = () => {
  $aframeScene.addEventListener('loaded', handleLoadedScene);
};

init();
