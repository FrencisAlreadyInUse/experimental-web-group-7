import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { inject, observer } from 'mobx-react';

const WhosPlaying = ({ gameStore }) => {
  const defaultBoxWidth = 1.5;
  const defaultCharLength = 6;
  const boxWidth = (defaultBoxWidth / defaultCharLength) * gameStore.currentPlayerName.length;
  return (
    <Fragment>
      <a-text
        id="player-currently-playing--text"
        position="0.048 -0.793 -6.82"
        color="#3737DD"
        wrap-count="15"
        text={`width:3; align:center; value: ${gameStore.currentPlayerName}`}
        font="https://cdn.aframe.io/fonts/KelsonSans.fnt"
      />
      <a-box
        id="player-currently-playing--box"
        position="0 -0.891 -7.098"
        width={boxWidth}
        height="0.65"
        depth="0.05"
        color="#FFD9B7"
      />
      <a-text
        id="player-currently-playing"
        position="0.048 -0.793 -5.649"
        rotation="-90 0 0"
        wrap-count="15"
        color="#3737DD"
        text="width:3; align:center; value: is currently playing"
        font="https://cdn.aframe.io/fonts/KelsonSans.fnt"
      />
    </Fragment>
  );
};

WhosPlaying.propTypes = {
  gameStore: PropTypes.object.isRequired,
};

export default inject('gameStore')(observer(WhosPlaying));
