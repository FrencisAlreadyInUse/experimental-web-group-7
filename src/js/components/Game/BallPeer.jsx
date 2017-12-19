/* eslint-disable no-nested-ternary */

import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import wait from './../../functions/wait.js';

const BallPeer = ({ gameStore }) => {
  let $node = null;

  const addCollisionDetection = () => {
    if (!gameStore.renderPeerBall) return;
    wait(500, () => $node.addEventListener('collide', gameStore.collisionHandler));
  };

  const removeCollisionDetection = () => {
    if (!gameStore.renderPeerBall) return;
    $node.removeEventListener('collide', gameStore.collisionHandler);
  };

  gameStore
    .on('addCollisionDetection', addCollisionDetection)
    .on('removeCollisionDetection', removeCollisionDetection);

  return gameStore.renderPeerBall ? (
    <a-sphere
      id="bowlingBall"
      radius=".75"
      dynamic-body="shape: sphere; sphereRadius: .77; mass: 50;"
      velocity="0 0 -35"
      src={gameStore.currentPlayingPeer.uri}
      position={`${gameStore.peerBallDirection} -1.25 -6`}
      ref={el => ($node = el)}
    />
  ) : null;
};

BallPeer.propTypes = {
  gameStore: PropTypes.object.isRequired,
};

export default inject('gameStore')(observer(BallPeer));
