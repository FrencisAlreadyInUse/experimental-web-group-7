import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Provider, observer } from 'mobx-react';

import Camera from './../components/Game/Camera.jsx';
import Assets from './../components/Game/Assets.jsx';
import Scores from './../components/Game/Scores.jsx';
import ConeIndicators from './../components/Game/ConeIndicators.jsx';
import DirectionIndicator from './../components/Game/DirectionIndicator.jsx';
import ThrowButton from './../components/Game/ThrowButton.jsx';
import Crown from './../components/Game/Crown.jsx';
import Ball from './../components/Game/Ball.jsx';
import Cones from './../components/Game/Cones.jsx';
import Peers from './../components/Game/Peers.jsx';
import Sky from './../components/Game/Sky.jsx';

const Game = ({ gameStore }) => (
  <Provider gameStore={gameStore}>
    <Fragment>
      <Camera />
      <Assets />
      <Scores />
      <DirectionIndicator />
      <ConeIndicators />
      <ThrowButton />
      <Crown position="-0.118 3.908 -7.022" />
      <Ball />
      <Cones />
      <Peers />
      <Sky />

      <a-collada-model position="-0.437 4.723 -4.777" rotation="-200 0 0" src="#arrow" />
      <a-collada-model static-body position="-4 -2.35 -5.52" scale="7.6 5 4.5" src="#bowling-alley" />
      <a-collada-model position="-4 -2.35 -7" scale="7.6 5 4.5" src="#cones-box" />
      <a-collada-model position="-4 0 12" scale="7.6 5 4.5" src="#players-table" />
    </Fragment>
  </Provider>
);

Game.propTypes = {
  gameStore: PropTypes.object.isRequired,
};

export default observer(Game);
