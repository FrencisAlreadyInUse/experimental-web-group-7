import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { inject, observer } from 'mobx-react';

const WhosPlaying = ({ gameStore }) => (
  <Fragment>
    <a-text
      id="player-currently-playing"
      position="-0.042 2.167 -4.957"
      wrap-count="15"
      color="white"
      text={`width:2; align:center; value: ${gameStore.currentPlayerName}`}
      font="https://cdn.aframe.io/fonts/KelsonSans.fnt"
    />

    <a-text
      id="player-currently-playing"
      position="-0.042 2 -4.957"
      wrap-count="15"
      color="white"
      text="width:2; align:center; value: is currently playing"
      font="https://cdn.aframe.io/fonts/KelsonSans.fnt"
    />
  </Fragment>
);

WhosPlaying.propTypes = {
  gameStore: PropTypes.object.isRequired,
};

export default inject('gameStore')(observer(WhosPlaying));
