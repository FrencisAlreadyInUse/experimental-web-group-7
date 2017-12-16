import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

const Scores = ({ gameStore }) => (
  <Fragment>
    <a-text
      id="first-throw"
      position="-0.446 3.9 -7"
      color="#d1b390"
      wrap-count="35"
      text={`width:6; align:center; value: ${gameStore.scores.one}`}
      font="https://cdn.aframe.io/fonts/KelsonSans.fnt"
    />
    <a-text
      id="second-throw"
      position="0.008 3.9 -7"
      color="#d1b390"
      wrap-count="35"
      text={`width: 6; align:center; value: ${gameStore.scores.two}`}
      font="https://cdn.aframe.io/fonts/KelsonSans.fnt"
    />
    <a-text
      id="total-score"
      position="0 3.2 -7"
      color="#2A2A9B"
      wrap-count="15"
      text={`width:6; align:center; value: ${gameStore.scores.total}`}
      font="https://cdn.aframe.io/fonts/KelsonSans.fnt"
    />
  </Fragment>
);

Scores.propTypes = {
  gameStore: PropTypes.object.isRequired,
};

export default inject('gameStore')(observer(Scores));
