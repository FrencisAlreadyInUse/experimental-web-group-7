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

let uniqueHits;

let currentRound = 1;
let currentThrow = 1;

let firstThrowScore = 0;
let currentThrowScore = 0;
let totalThrowScore = 0;

let canThrow = true;

const setAttributeMultiple = ($nodes, attribute, value) => {
  Array.from($nodes).forEach($node => $node.setAttribute(attribute, value));
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

    if (score === 10) setScoreValue($firstThrow, 'X');
    else setScoreValue($firstThrow, score);
  }

  // this is our second throw
  if (currentThrow === 2) {
    totalThrowScore = score + firstThrowScore;
    setScoreValue($secondThrow, score);
  }

  setScoreValue($totalScore, totalThrowScore);
};

const handleCollision = e => {
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
        $conesHitSound.play();
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

const regenerateCones = () => {
  //
  // only set new cones for hit ones
  //
  // const generateCone = () => {
  //   const $cone = document.createElement('a-collada-model');
  //   $cone.setAttribute('id', '10');
  //   $cone.setAttribute('src', '#cone');
  //   $cone.setAttribute('position', '-1.5 -2 -38');
  //   $cone.setAttribute('radius', '.75');
  //   $cone.setAttribute('dynamic-body', 'shape: box; mass: 1;');
  //   $aframeScene.appendChild($cone);
  // };
};

const resetSceneForNextPlayer = () => {
  regenerateCones();
};

const endOfThrowCallback = $ball => {
  removeBallAndHitCones($ball);

  // we will go to throw nr 2 here
  if (currentThrow === 1) {
    firstThrowScore = currentThrowScore;

    if (firstThrowScore < 10) {
      canThrow = true;
      currentThrow = 2;

      // ball is ready to be thrown again, show "throw" message
      setAttributeMultiple($throwMessage, 'visible', true);
    } else {
      // we threw a strike, next player's turn
      console.log("we threw a strike, next player's turn");
      resetSceneForNextPlayer();
    }
  }

  // we did our nr 2 throw, next player's turn
  if (currentThrow === 2) {
    currentRound += 1;
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
  setAttributeMultiple($throwMessage, 'visible', false);

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
