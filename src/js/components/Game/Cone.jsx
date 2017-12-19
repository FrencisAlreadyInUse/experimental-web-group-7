import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import wait from './../../functions/wait.js';

class Cone extends Component {
  componentWillMount() {
    this.$node = null;
  }

  componentDidMount() {
    if (this.props.rendered) {
      this.$node.addEventListener('collide', this.props.gameStore.collisionHandler);
    }
  }

  componentWillUnmount() {
    if (this.props.rendered) {
      this.$node.removeEventListener('collide', this.props.gameStore.collisionHandler);
    }
  }

  render() {
    return this.props.rendered ? (
      <a-collada-model
        src="#cone"
        radius=".75"
        dynamic-body="shape: box; mass: 1;"
        className="cone"
        id={this.props.id}
        position={this.props.position}
        ref={el => (this.$node = el)}
      />
    ) : null;
  }
}

Cone.propTypes = {
  gameStore: PropTypes.object.isRequired,
  position: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  rendered: PropTypes.bool.isRequired,
};

export default inject('gameStore')(observer(Cone));
