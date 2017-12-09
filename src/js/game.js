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

let firstThrow = '';
const secondThrow = '';
let counter = 0;

const setScoring = (first = '-', second = '-', totalScore = 0) => {
  $firstThrow.setAttribute('text', `width:6; align:center; value: ${first}`);
  $secondThrow.setAttribute('text', `width:6; align:center; value: ${second}`);
  $totalScore.setAttribute('text', `width:6; align:center; value: ${totalScore}`);
};

const handleCollision = (e) => {
  if (!e.detail.body.el.id) return;
  const $hit = parseInt(e.detail.body.el.id, 10);
  if (isNaN($hit)) return;
  hitCones.push($hit);

  const uniqueHits = new Set(hitCones);
  firstThrow = uniqueHits.size;

  uniqueHits.forEach(id => {
    $coneIndicators.forEach(
      indicator => {
        if (parseInt(indicator.dataset.id, 10) === id) {
          indicator.setAttribute('color', 'red');
          setScoring(firstThrow, secondThrow, firstThrow + secondThrow);
        }
      },
    );
  });
};

const getAttributes = () => {
  $currentSliderPosition = $indicatorSlider.getAttribute('position');
  requestAnimationFrame(getAttributes);
};


const generateScene = () => {
  getAttributes();
  setScoring();
};

const resetScoring = () => {
  hitCones = [];
};

const generateBall = () => {
  const $ball = document.createElement('a-sphere');
  $ball.setAttribute('id', 'bowlingBall');
  $ball.setAttribute('src', '#face-ball');
  $ball.setAttribute('position', `${$currentSliderPosition.x} -1.25 -10`);
  $ball.setAttribute('radius', '.75');
  $ball.setAttribute('dynamic-body', 'shape: sphere; sphereRadius: .77; mass: 50;');
  $ball.setAttribute('velocity', '0 0 -35');
  $aframeScene.appendChild($ball);

  setTimeout(() => {
    $aframeScene.removeChild($ball);
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
  generateBall();
};

const handleLoadedScene = () => {
  $button.addEventListener('click', generateInteractiveScene);
  generateScene();
};

const init = () => {
  $aframeScene.addEventListener('loaded', handleLoadedScene);
};

init();
