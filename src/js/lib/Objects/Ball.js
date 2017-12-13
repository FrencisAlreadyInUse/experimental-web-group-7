import setAttributes from './../setAttributes.js';

export default class {
  constructor(targetPosition) {
    const $ball = document.createElement('a-sphere');
    setAttributes($ball, {
      id: 'bowlingBall',
      src: '#face-ball',
      position: `${targetPosition} -1.25 -10`,
      radius: '.75',
      'dynamic-body': 'shape: sphere; sphereRadius: .77; mass: 50;',
      velocity: '0 0 -35',
    });
    return $ball;
  }
}
