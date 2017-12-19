import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

const ThrowButton = ({ gameStore }) => {
  const handleThrowBall = () => {
    gameStore.startThrow();
  };

  return (
    <Fragment>
      <a-text
        position="0.048 -0.793 -6.82"
        color="#FFD9B7"
        wrap-count="15"
        text="width:3; align:center; value: THROW"
        font="https://cdn.aframe.io/fonts/KelsonSans.fnt"
      >
        <a-animation begin="click" easing="ease-in-out" attribute="opacity" to="0" dur="600" />
      </a-text>
      <a-box
        position="0 -0.891 -7.098"
        width="1.5 "
        height="0.65"
        depth="0.05"
        color="#3737DD"
        onClick={handleThrowBall}
      />
    </Fragment>
  );
};

ThrowButton.propTypes = {
  gameStore: PropTypes.object.isRequired,
};

export default inject('gameStore')(observer(ThrowButton));
