import setAttributes from './../../functions/setAttributes.js';

export default class Ball {
  constructor(attributes) {
    const $ball = document.createElement('a-sphere');
    setAttributes($ball, {
      id: 'bowlingBall',
      src: '#face-ball',
      radius: '.75',
      'dynamic-body': 'shape: sphere; sphereRadius: .77; mass: 50;',
      velocity: '0 0 -35',
      ...attributes,
    });
    return $ball;
  }
}
