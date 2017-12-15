import React from 'react';
import PropTypes from 'prop-types';

const ConeIndicator = ({ id, position, hit }) => (
  <a-sphere
    data-id={id}
    className="cone-indicator"
    position={position}
    radius=".05"
    color={hit ? 'red' : 'white'}
  />
);

ConeIndicator.propTypes = {
  id: PropTypes.number.isRequired,
  position: PropTypes.string.isRequired,
  hit: PropTypes.bool.isRequired,
};

export default ConeIndicator;
