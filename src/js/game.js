const $aframeScene = document.querySelector('a-scene');
const $button = document.getElementById('startButton');

const $indicatorSlider = document.getElementById('ball-pos');
let $currentSliderPosition;

const $cones = document.querySelectorAll('.cones');
const $coneIndicators = document.querySelectorAll('.cone-indicator');
let hitCones = [];

const $firstThrow = document.getElementById('first-throw');
const $secondThrow = document.getElementById('second-throw');
const $totalScore = document.getElementById('total-score');

let counter = 0;

let uniqueHits;

let currentRound = 1;
let currentThrow = 1;

let firstThrowScore = 0;
let currentThrowScore = 0;
let totalThrowScore = 0;

let canThrow = true;

const setScoring = score => {
  //

  if (currentThrow === 1) {
    currentThrowScore = score;
    totalThrowScore = currentThrowScore;

    console.log('throw 1', score);
    $firstThrow.setAttribute('text', `width:6; align:center; value: ${score}`);
  }
  if (currentThrow === 2) {
    totalThrowScore = score + firstThrowScore;

    console.log('throw 2', score);
    $secondThrow.setAttribute('text', `width:6; align:center; value: ${score}`);
  }

  // update game
  $totalScore.setAttribute('text', `width:6; align:center; value: ${totalThrowScore}`);
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

const resetScoring = () => {
  hitCones = [];
};

const removeBallAndHitCones = $ball => {
  console.log('RESET');

  uniqueHits.forEach(id => {
    // hitCones = hitCones.filter(c => c === id);
    $aframeScene.removeChild(document.getElementById(id));
    uniqueHits.delete(id);
  });

  uniqueHits.clear();

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

  // ...
};

/**
 * Generates the bowling ball
 */
const generateBall = targetPosition => {
  const $ball = document.createElement('a-sphere');
  $ball.setAttribute('id', 'bowlingBall');
  $ball.setAttribute('src', '#face-ball');
  $ball.setAttribute('position', `${targetPosition} -1.25 -10`);
  $ball.setAttribute('radius', '.75');
  $ball.setAttribute('dynamic-body', 'shape: sphere; sphereRadius: .77; mass: 50;');
  $ball.setAttribute('velocity', '0 0 -35');
  $aframeScene.appendChild($ball);

  canThrow = false;

  setTimeout(() => {
    // Array.from($cones).forEach($cone => $aframeScene.removeChild($cone));

    removeBallAndHitCones($ball);

    if (currentThrow === 1) {
      firstThrowScore = currentThrowScore;
      canThrow = true;
      currentThrow = 2;
    }
    if (currentThrow === 2) {
      // next player

      currentRound += 1;

      resetSceneForNextPlayer();
    }
  }, 3000);

  $ball.addEventListener('collide', handleCollision);
};

const generateInteractiveScene = () => {
  Array.from($cones).forEach(cone => {
    cone.addEventListener('collide', handleCollision);
  });
  counter += 1;
  if (counter === 3) {
    console.log('[generateBall]', 'Reset Scoring (exept for the Total) / Reset Alley');
    resetScoring();
  }
  if (canThrow) generateBall($currentSliderPosition.x);
};

const handleLoadedScene = () => {
  $button.addEventListener('click', generateInteractiveScene);
  generateScene();
};

const init = () => {
  $aframeScene.addEventListener('loaded', handleLoadedScene);
};

init();
