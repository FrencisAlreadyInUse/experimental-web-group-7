import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

class PeerBall extends Component {
  componentWillMount() {
    this.$node = null;
  }

  componentDidMount() {
    this.$node.addEventListener('collide', this.props.gameStore.collisionHandler);
  }

  componentWillUnmount() {
    this.$node.removeEventListener('collide', this.props.gameStore.collisionHandler);
  }

  render() {
    return (
      <a-sphere
        id="bowlingBall"
        radius=".75"
        dynamic-body="shape: sphere; sphereRadius: .77; mass: 50;"
        velocity="0 0 -35"
        src={`#bowling-ball-peer-${this.props.gameStore.currentPlayerId}`}
        position={`${this.props.gameStore.peerBallDirection} -1.25 -6`}
        ref={el => (this.$node = el)}
      />
    );
  }
}

PeerBall.propTypes = {
  gameStore: PropTypes.object.isRequired,
};

export default inject('gameStore')(observer(PeerBall));
