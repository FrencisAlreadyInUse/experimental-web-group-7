import React from 'react';

const Camera = () => (
  <a-camera>
    <a-cursor fuse="false" fuse-timeout="10" color="#2A2A9B" scale="1 1 1">
      <a-animation
        begin="click"
        easing="ease-in"
        attribute="scale"
        fill="backwards"
        to="0.1 0.1 0.1"
        dur="250"
      />
      <a-animation
        begin="cursor-fusing"
        easing="ease-in"
        attribute="scale"
        dur="250"
        fill="backwards"
        to="0.1 0.1 0.1"
      />
    </a-cursor>
  </a-camera>
);

export default Camera;
