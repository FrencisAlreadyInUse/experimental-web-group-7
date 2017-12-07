const $aframeScene = document.querySelector('a-scene');
const $ball = document.getElementById('bowlingBall');

const handleThrowBall = () => {
  console.log('[handleThrowBall]', 'clicked');
};

const handleCollision = (e) => {
  console.log(`Player has collided with body #${e.detail.body.id}`);
  console.log(`Player has collided with body #${e.detail.target.el}`);
  console.log(`Player has collided with body #${e.detail.body.el}`);
  console.log(`Player has collided with body #${e.detail.contact.ni}`);

  // e.detail.target.el; // Original entity (playerEl).
  // e.detail.body.el; // Other entity, which playerEl touched.
  // e.detail.contact; // Stats about the collision (CANNON.ContactEquation).
  // e.detail.contact.ni; // Normal (direction) of the collision (CANNON.Vec3).
};

const init = () => {
  $aframeScene.addEventListener('click', handleThrowBall);
  $ball.addEventListener('collide', handleCollision);
};

init();
