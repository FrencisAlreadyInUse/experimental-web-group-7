import React from 'react';
import PropTypes from 'prop-types';

const Crown = ({ position }) => (
  <a-collada-model
    // position="-5.28 1.082 6.474"
    position={position}
    rotation="10 0 15"
    scale="1.4 1 1.4"
    src="#winners-crown"
  >
    <a-animation attribute="rotation" repeat="indefinite" to="10 360 15" />
  </a-collada-model>
);

Crown.propTypes = {
  position: PropTypes.string.isRequired,
};

export default Crown;
