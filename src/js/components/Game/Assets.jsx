import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import Asset from './Asset.jsx';

const Assets = ({ gameStore }) => (
  <a-assets id="assets">
    <Asset id="cone" src="/assets/collada/bowling-cone.dae" />
    <Asset id="triangle" src="/assets/collada/cones-indicator-triangle.dae" />
    <Asset id="bowling-alley" src="/assets/collada/bowling-alley.dae" />
    <Asset id="cones-box" src="/assets/collada/cones-box.dae" />
    <Asset id="players-table" src="/assets/collada/players-table.dae" />
    <Asset id="winners-crown" src="/assets/collada/winners-crown.dae" />
    <Asset id="ball-slider" src="/assets/collada/ball-slider.dae" />
    <Asset id="ball-slider-indicator" src="/assets/collada/ball-slider-indicator.dae" />
    <Asset id="strike" src="/assets/collada/strike-msg.dae" />
    <Asset id="arrow" src="/assets/collada/arrow.dae" />

    {gameStore.me.uri ? <Asset id="bowling-ball-me" src={gameStore.me.uri} /> : null}

    {gameStore.peersArray.map(peer => (
      <Asset
        key={peer.id}
        id={`bowling-ball-peer-${peer.id}`}
        src={peer.uri}
      />
    ))}
  </a-assets>
);

Assets.propTypes = {
  gameStore: PropTypes.object.isRequired,
};

export default inject('gameStore')(observer(Assets));
