import { el } from 'redom';

export default class UserScore {
  constructor(attributes) {
    this.id = attributes.id;

    let position = '';

    if (this.id === 1) position = '-5.3 .5 6.5';
    if (this.id === 2) position = '-5.3 2.5 9';
    if (this.id === 3) position = '5.3 2.5 9';
    if (this.id === 4) position = '5.3 2.5 6.5';

    this.el = el('a-text', {
      'wrap-count': '20',
      rotation: '0 180 0',
      text: 'align: center; width: 6; value: -;',
      font: 'https://cdn.aframe.io/fonts/KelsonSans.fnt',
      position,
    });
  }
}
