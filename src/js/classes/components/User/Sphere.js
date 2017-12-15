import { el } from 'redom';

export default class UserSphere {
  constructor(attributes) {
    this.id = attributes.id;

    let position = '';

    if (this.id === 1) position = '-5.3 .5 6.5';
    if (this.id === 2) position = '-5.3 .5 9';
    if (this.id === 3) position = '5.3 .5 9';
    if (this.id === 4) position = '5.3 .5 6.5';

    this.el = el('a-sphere', {
      rotation: '0 100 0',
      radius: '.85',
      position,
      ...attributes,
    });
  }
}
