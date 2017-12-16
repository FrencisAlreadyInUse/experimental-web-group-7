import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

class DirectionIndicator extends Component {
  componentDidMount() {
    window.requestAnimationFrame(this.fetchDirection);
  }

  $node = null;

  fetchDirection = () => {
    window.requestAnimationFrame(this.fetchDirection);

    if (!this.$node) return;
    const position = this.$node.getAttribute('position').x;
    if (position) this.props.gameStore.updateDirectionIndicatorValue(position);
  };

  render() {
    return this.props.gameStore.renderDirectionIndicator ? (
      <Fragment>
        <a-collada-model position="-1.38 -1.29 -4.86" rotation="-15 0 0" src="#ball-slider" />
        <a-collada-model
          id="ball-pos"
          position="-1.45 -1.29 -4.86"
          rotation="-15 0 0"
          src="#ball-slider-indicator"
          ref={el => (this.$node = el)}
        >
          <a-animation
            attribute="position"
            direction="alternate"
            dur="900"
            easing="ease-in-out"
            repeat="indefinite"
            to="1.22 -1.29 -4.86"
          />
        </a-collada-model>
      </Fragment>
    ) : null;
  }
}

DirectionIndicator.propTypes = {
  gameStore: PropTypes.object.isRequired,
};

export default inject('gameStore')(observer(DirectionIndicator));
