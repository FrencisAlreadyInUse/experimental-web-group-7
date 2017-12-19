import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import ConeIndicator from './ConeIndicator.jsx';

const ConeIndicators = ({ gameStore }) => (
  <Fragment>
    {gameStore.coneIndicators.map(item => <ConeIndicator key={item.id} {...item} />)}
    <a-collada-model position="4 -0.8 -3.4" scale="1.5 1.5 1.5" src="#triangle" />
  </Fragment>
);

ConeIndicators.propTypes = {
  gameStore: PropTypes.object.isRequired,
};

export default inject('gameStore')(observer(ConeIndicators));
