import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import Cones from './Cones.jsx';
import ConeIndicators from './ConeIndicators.jsx';
import DirectionIndicator from './DirectionIndicator.jsx';
import ThrowButton from './ThrowButton.jsx';

const Alley = ({ gameStore }) => (
  <Fragment>
    <a-collada-model static-body position="-4 -2.35 -5.52" scale="7.6 5 4.5" src="#bowling-alley" />
    <a-collada-model position="-4 -2.35 -7" scale="7.6 5 4.5" src="#cones-box" />

    <Cones />
    <DirectionIndicator />
    <ConeIndicators />
    {gameStore.renderThrowButton ? <ThrowButton /> : null}
  </Fragment>
);

Alley.propTypes = {
  gameStore: PropTypes.object.isRequired,
};

export default inject('gameStore')(observer(Alley));
