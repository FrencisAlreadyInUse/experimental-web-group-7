import React, { Fragment } from 'react';

import Cones from './Cones.jsx';
import ConeIndicators from './ConeIndicators.jsx';
import DirectionIndicator from './DirectionIndicator.jsx';
import ThrowButton from './ThrowButton.jsx';

const Alley = () => (
  <Fragment>
    <a-collada-model static-body position="-4 -2.35 -5.52" scale="7.6 5 4.5" src="#bowling-alley" />
    <a-collada-model position="-4 -2.35 -7" scale="7.6 5 4.5" src="#cones-box" />

    <Cones />
    <DirectionIndicator />
    <ConeIndicators />
    <ThrowButton />
  </Fragment>
);

export default Alley;
