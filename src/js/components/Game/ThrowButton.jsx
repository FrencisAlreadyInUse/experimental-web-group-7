import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

class ThrowButton extends Component {
  constructor(props) {
    super(props);

    this.$node = null;
  }

  componentDidMount() {
    this.$node.addEventListener('click', this.props.gameStore.throwBall);
  }

  render() {
    return (
      <Fragment>
        <a-text
          class="throw-message"
          position="0.048 -0.793 -6.82"
          color="#FFD9B7"
          wrap-count="15"
          text="width:3; align:center; value: THROW"
          font="https://cdn.aframe.io/fonts/KelsonSans.fnt"
          opacity={this.props.gameStore.renderThrowButton ? '1' : '0'}
        >
          <a-animation begin="click" easing="ease-in-out" attribute="opacity" to="0" dur="600" />
        </a-text>
        <a-box
          class="throw-message"
          id="start-button"
          position="0 -0.891 -7.098"
          width="1.5 "
          height="0.65"
          depth="0.05"
          color="#3737DD"
          opacity={this.props.gameStore.renderThrowButton ? '1' : '0'}
          ref={el => (this.$node = el)}
        >
          <a-animation begin="click" easing="ease-in-out" attribute="opacity" to="0" dur="600" />
        </a-box>
      </Fragment>
    );
  }
}

ThrowButton.propTypes = {
  gameStore: PropTypes.object.isRequired,
};

export default inject('gameStore')(observer(ThrowButton));
