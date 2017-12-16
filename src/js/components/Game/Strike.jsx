import React from 'react';

const Strike = () => (
  <a-collada-model
    src="#strike"
    id="strike-msg"
    position="-2.347 -4 -8.793"
    rotation="90 0 0"
    scale="0.2 0.2 0.2"
  >
    <a-animation
      easing="ease-in-out"
      attribute="position"
      direction="alternate"
      repeat="1"
      delay="1000"
      dur="1500"
      to="-2.347 1.994 -8.793"
    />
  </a-collada-model>
);

export default Strike;
