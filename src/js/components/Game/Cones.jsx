import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import Cone from './Cone.jsx';

const Cones = ({ gameStore }) => (
  <Fragment>{gameStore.renderedCones.map(cone => <Cone key={cone.id} {...cone} />)}</Fragment>
);

Cones.propTypes = {
  gameStore: PropTypes.object.isRequired,
};

export default inject('gameStore')(observer(Cones));
