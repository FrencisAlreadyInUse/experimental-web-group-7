import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import Peer from './Peer.jsx';

const Peers = ({ gameStore }) => (
  <Fragment>
    {gameStore.peersArray.map(peer => <Peer key={peer.id} {...peer} />)}
    <a-collada-model position="-4 0 12" scale="7.6 5 4.5" src="#players-table" />
  </Fragment>
);

Peers.propTypes = {
  gameStore: PropTypes.object.isRequired,
};

export default inject('gameStore')(observer(Peers));
