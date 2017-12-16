import { el } from 'redom';

export default class Ball {
  constructor(attributes) {
    this.el = el('a-sphere#bowlingBall', {
      radius: '.75',
      color: 'black',
      'dynamic-body': 'shape: sphere; sphereRadius: .77; mass: 50;',
      velocity: '0 0 -35',
      ...attributes,
    });
  }

  addCollisionDetection(handler) {
    this.el.addEventListener('collide', handler);
  }
}
