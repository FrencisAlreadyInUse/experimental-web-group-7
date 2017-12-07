const $aframeScene = document.querySelector('a-scene');
const $button = document.getElementById('startButton');
// const $indicatorXMin = '-2.730';
// const $indicatorXMax = '-0.052';

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
  const $ball = document.createElement('a-sphere');
  $ball.setAttribute('id', 'bowlingBall');
  $ball.setAttribute('src', '#face-ball');
  $ball.setAttribute('position', '0 -1.25 -10');
  $ball.setAttribute('radius', '.75');
  $ball.setAttribute('dynamic-body', 'shape: sphere; sphereRadius: .77; mass: 50;');
  $ball.setAttribute('velocity', '0 0 -35');

  setTimeout(() => {
    $aframeScene.appendChild($ball);
  }, 1000);

  setTimeout(() => {
    $aframeScene.removeChild($ball);
  }, 3000);

  $ball.addEventListener('collide', handleCollision);
};


const generateInteractiveScene = () => {
  generateCones();
  generateBall();
};

const generateSliderIndicator = () => {
  const $slider = document.createElement('a-collada-model');
  $slider.setAttribute('id', 'ballSlider');
  $slider.setAttribute('src', '#ball-slider-indicator');
  $slider.setAttribute('position', {
    x: -2.730,
    y: -1.29,
    z: -4.86,
  });
  $slider.setAttribute('rotation', '-15 0 0');
  $aframeScene.appendChild($slider);

  // if ($slider.position === '-2.730 -1.29 -4.86') {
  //   $slider.position === '-0.052 -1.29 -4.86';
  //   requestAnimationFrame(generateSliderIndicator);
  // } else {
  //   $slider.position === '-2.730 -1.29 -4.86';
  //   requestAnimationFrame(generateSliderIndicator);
  // }
};

const generateScene = () => {
  // Slider Indicator
  requestAnimationFrame(generateSliderIndicator);
};

const handleLoadedScene = () => {
  $button.addEventListener('click', generateInteractiveScene);
  generateScene();
};

const init = () => {
  $aframeScene.addEventListener('loaded', handleLoadedScene);
};

init();
