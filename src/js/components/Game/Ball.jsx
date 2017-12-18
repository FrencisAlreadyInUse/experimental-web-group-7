import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import wait from './../../functions/wait.js';

const Ball = ({ gameStore, me }) => {
  let $node = null;

  const addCollisionDetection = () => {
    wait(500, () => $node.addEventListener('collide', gameStore.collisionHandler));
  };

  const removeCollisionDetection = () => {
    $node.removeEventListener('collide', gameStore.collisionHandler);
  };

  gameStore
    .on('addCollisionDetection', addCollisionDetection)
    .on('removeCollisionDetection', removeCollisionDetection);

  const ball = (
    <a-sphere
      id="bowlingBall"
      radius=".75"
      dynamic-body="shape: sphere; sphereRadius: .77; mass: 50;"
      velocity="0 0 -35"
      src={me ? '#bowling-ball-me' : gameStore.playingPeer.uri}
      position={`${gameStore.ballDirection} -1.25 -6`}
      ref={el => ($node = el)}
    />
  );

  if (me) return gameStore.renderBall ? ball : null;
  return gameStore.renderPeerBall ? ball : null;
};

Ball.propTypes = {
  gameStore: PropTypes.object.isRequired,
  me: PropTypes.bool,
};

Ball.defaultProps = {
  me: true,
};

export default inject('gameStore')(observer(Ball));
