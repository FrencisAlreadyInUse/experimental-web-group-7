import setAttributes from './../../functions/setAttributes.js';

export default class User {
  constructor(nr, sphereAttributes) {
    const $fragment = new DocumentFragment();
    const $text = document.createElement('a-text');
    const $sphere = document.createElement('a-sphere');

    let textPosition;
    let spherePosition;

    switch (nr) {
      case 1:
        textPosition = '-5.3 .5 6.5';
        spherePosition = '-5.3 .5 6.5';
        break;
      case 2:
        textPosition = '-5.3 2.5 9';
        spherePosition = '-5.3 .5 9';
        break;
      case 3:
        textPosition = '5.3 2.5 9';
        spherePosition = '5.3 .5 9';
        break;
      case 4:
        textPosition = '5.3 2.5 6.5';
        spherePosition = '5.3 .5 6.5';
        break;
      default:
        textPosition = '';
        spherePosition = '';
        break;
    }

    setAttributes($text, {
      'wrap-count': '20',
      rotation: '0 180 0',
      text: 'align: center; width: 6; value: -;',
      font: 'https://cdn.aframe.io/fonts/KelsonSans.fnt',
      position: textPosition,
    });

    setAttributes($sphere, {
      rotation: '0 100 0',
      radius: '.85',
      position: spherePosition,
      ...sphereAttributes,
    });

    $fragment.appendChild($text);
    $fragment.appendChild($sphere);

    return $fragment;
  }
}

