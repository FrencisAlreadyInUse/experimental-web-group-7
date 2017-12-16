import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import Peer from './Peer.jsx';

const Peers = ({ gameStore }) => (
  <Fragment>{gameStore.peersArray.map(peer => <Peer key={peer.id} {...peer} />)}</Fragment>
);

Peers.propTypes = {
  gameStore: PropTypes.object.isRequired,
};

export default inject('gameStore')(observer(Peers));
