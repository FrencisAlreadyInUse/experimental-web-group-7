const $aframeScene = document.querySelector('a-scene');
const $button = document.getElementById('startButton');
const $indicatorSlider = document.getElementById('ball-pos');
const $cones = document.querySelectorAll('.cones');
let $currentSliderPosition;

const handleCollision = (e) => {
  // make array of all hit cones with their id and make the array unique (new Set())
  if (!e.detail.body.el.id) return;
  const $hitCones = [];
  const $hit = parseInt(e.detail.body.el.id, 10);
  if (NaN) return;

  $hitCones.push($hit);
  console.log('[handleCollision]', $hitCones);
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
  generateBall();
};

const getAttributes = () => {
  $currentSliderPosition = $indicatorSlider.getAttribute('position');

  requestAnimationFrame(getAttributes);
};

const generateScene = () => {
  getAttributes();
};

const handleLoadedScene = () => {
  $button.addEventListener('click', generateInteractiveScene);
  generateScene();
};

const init = () => {
  $aframeScene.addEventListener('loaded', handleLoadedScene);
};

init();
