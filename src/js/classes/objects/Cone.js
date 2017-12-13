import setAttributes from './../../functions/setAttributes.js';

export default class Cone {
  constructor(id, pos) {
    const $cone = document.createElement('a-collada-model');
    setAttributes($cone, {
      id,
      class: 'cone',
      src: '#cone',
      position: pos,
      radius: '.75',
      'dynamic-body': 'shape: box; mass: 1;',
    });
    return $cone;
  }
}
