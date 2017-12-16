import React from 'react';

const Crown = () => (
  <a-collada-model
    position="-5.28 1.082 6.474"
    rotation="10 0 15"
    scale="1.4 1 1.4"
    src="#winners-crown"
  >
    <a-animation attribute="rotation" repeat="indefinite" to="10 360 15" />
  </a-collada-model>
);

export default Crown;
