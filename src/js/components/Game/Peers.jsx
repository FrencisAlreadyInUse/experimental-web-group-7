import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Peer from './Peer.jsx';

const Peers = ({ gameStore }) => (
  <Fragment>{gameStore.friends.map(friend => <Peer {...friend} />)}</Fragment>
);

Peers.propTypes = {
  gameStore: PropTypes.object.isRequired,
};

export default Peers;
