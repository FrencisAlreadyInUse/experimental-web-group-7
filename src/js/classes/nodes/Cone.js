import setAttributes from './../../functions/setAttributes.js';

export default class Cone {
  constructor(attributes) {
    const $cone = document.createElement('a-collada-model');
    setAttributes($cone, {
      class: 'cone',
      src: '#cone',
      radius: '.75',
      'dynamic-body': 'shape: box; mass: 1;',
      ...attributes,
    });
    return $cone;
  }
}
