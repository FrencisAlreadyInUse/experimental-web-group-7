import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import Crown from './Crown.jsx';

const Peer = ({
  gameStore, id, sphere, score, crown,
}) => (
  <Fragment>
    {gameStore.currentLeaders.indexOf(id) !== -1 ? <Crown position={crown.position} /> : null}
    <a-text
      wrap-count="20"
      rotation="0 180 0"
      text={`align: center; width: 6; value: ${score.value};`}
      font="https://cdn.aframe.io/fonts/KelsonSans.fnt"
      position={score.position}
    />
    <a-sphere rotation="0 100 0" radius=".85" position={sphere.position} src={`#${id}`} />
  </Fragment>
);

Peer.propTypes = {
  gameStore: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  sphere: PropTypes.string.isRequired,
  crown: PropTypes.string.isRequired,
  score: PropTypes.object.isRequired,
};

export default inject('gameStore')(observer(Peer));
