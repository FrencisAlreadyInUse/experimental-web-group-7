import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import Crown from './Crown.jsx';

const Peer = ({
  gameStore, id, ballPosition, scorePosition, crownPosition, score,
}) => (
  <Fragment>
    {gameStore.currentLeaders.indexOf(id) !== -1 ? <Crown position={crownPosition} /> : null}
    <a-text
      wrap-count="20"
      rotation="0 180 0"
      text={`align: center; width: 6; value: ${score};`}
      font="https://cdn.aframe.io/fonts/KelsonSans.fnt"
      position={scorePosition}
    />
    <a-sphere rotation="0 100 0" radius=".85" position={ballPosition} src={`#bowling-ball-peer-${id}`} />
  </Fragment>
);

Peer.propTypes = {
  gameStore: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  ballPosition: PropTypes.string.isRequired,
  scorePosition: PropTypes.string.isRequired,
  crownPosition: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
};

export default inject('gameStore')(observer(Peer));
