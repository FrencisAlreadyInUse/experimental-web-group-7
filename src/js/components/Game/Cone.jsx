import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

class Cone extends Component {
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
      <a-collada-model
        src="#cone"
        radius=".75"
        dynamic-body="shape: box; mass: 1;"
        className="cone"
        id={this.props.id}
        position={this.props.position}
        ref={el => (this.$node = el)}
      />
    );
  }
}

Cone.propTypes = {
  gameStore: PropTypes.object.isRequired,
  position: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
};

export default inject('gameStore')(observer(Cone));
