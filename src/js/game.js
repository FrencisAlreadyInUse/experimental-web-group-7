const $aframeScene = document.querySelector('a-scene');
const $button = document.getElementById('startButton');
const $indicatorSlider = document.getElementById('ball-pos');
let $currentSliderPosition;
// const $indicatorSliderAnim = document.getElementById('working-slider-animate');
// const $indicatorXMin = '-2.730';
// const $indicatorXMax = '-0.052';

// get position attributen van die slider

const handleCollision = (e) => {
  console.log('[handleCollision]', e.detail.contact);
  // console.log('[handleCollision]', e);
  // console.log(`Player has collided with body #${e.detail.body.id}`);
  // console.log(`Player has collided with body #${e.detail.target.el}`);
  // console.log(`Player has collided with body #${e.detail.body.el}`);
  // console.log(`Player has collided with body #${e.detail.contact.ni}`);

  // e.detail.target.el; // Original entity (playerEl).
  // e.detail.body.el; // Other entity, which playerEl touched.
  // e.detail.contact; // Stats about the collision (CANNON.ContactEquation).
  // e.detail.contact.ni; // Normal (direction) of the collision (CANNON.Vec3).
};

const generateCones = () => {
  const $cone = document.createElement('a-collada-model');
  $cone.setAttribute('id', '10');
  $cone.setAttribute('src', '#cone');
  $cone.setAttribute('position', '-1.5 -2 -38');
  $cone.setAttribute('radius', '.75');
  $cone.setAttribute('dynamic-body', 'shape: box; mass: 1;');
  $aframeScene.appendChild($cone);

  setTimeout(() => {
    $aframeScene.removeChild($cone);
  }, 3500);
};

const generateBall = () => {
  console.log('[generateBall]', $currentSliderPosition.x);
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
  generateCones();
  generateBall();
};

const getAttributes = () => {
  $currentSliderPosition = $indicatorSlider.getAttribute('position');

  console.log('[getAttributes]', $currentSliderPosition.x);

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
