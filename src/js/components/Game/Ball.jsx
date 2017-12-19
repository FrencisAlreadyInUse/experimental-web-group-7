/* eslint-disable no-nested-ternary */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

class Ball extends Component {
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
        src="#bowling-ball-me"
        position={`${this.props.gameStore.ballDirection} -1.25 -6`}
        ref={el => (this.$node = el)}
      />
    );
  }
}

Ball.propTypes = {
  gameStore: PropTypes.object.isRequired,
};

export default inject('gameStore')(observer(Ball));
