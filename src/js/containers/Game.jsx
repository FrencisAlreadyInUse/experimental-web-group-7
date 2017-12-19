import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Provider, observer } from 'mobx-react';

import Camera from './../components/Game/Camera.jsx';
import Assets from './../components/Game/Assets.jsx';
import Alley from './../components/Game/Alley.jsx';
import Arrow from './../components/Game/Arrow.jsx';
import Scores from './../components/Game/Scores.jsx';
import WhosPlaying from './../components/Game/WhosPlaying.jsx';
import Ball from './../components/Game/Ball.jsx';
import BallPeer from './../components/Game/BallPeer.jsx';
import Peers from './../components/Game/Peers.jsx';
import Sky from './../components/Game/Sky.jsx';

const Game = ({ gameStore }) => (
  <Provider gameStore={gameStore}>
    <Fragment>
      <Camera />
      <Assets />
      <Alley />
      <Arrow />
      <Scores />
      {gameStore.currentPlayingPeer.id !== 'me' ? <WhosPlaying /> : null}
      {gameStore.renderBall ? <Ball /> : null}
      {gameStore.renderPeerBall ? <BallPeer /> : null}
      <Peers />
      <Sky />
    </Fragment>
  </Provider>
);

Game.propTypes = {
  gameStore: PropTypes.object.isRequired,
};

export default observer(Game);
