import { el } from 'redom';

export default class Cone {
  constructor(attributes) {
    this.id = attributes.id;

    this.el = el('a-collada-model.cone', {
      src: '#cone',
      radius: '.75',
      'dynamic-body': 'shape: box; mass: 1;',
      ...attributes,
    });
  }

  addCollisionDetection(handler) {
    this.el.addEventListener('collide', handler);
  }
}
