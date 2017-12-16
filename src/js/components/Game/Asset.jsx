import React from 'react';
import PropTypes from 'prop-types';

const Asset = ({ id, src }) => <a-asset-item id={id} src={src} />;

Asset.propTypes = {
  id: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
};

export default Asset;
