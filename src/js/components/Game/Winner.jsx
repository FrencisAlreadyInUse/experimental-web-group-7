import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { inject, observer } from 'mobx-react';

import Crown from './Crown.jsx';

const Winner = ({ gameStore }) => {
  console.log('[Winner]', gameStore.leaderName);
  return (
    <Fragment>
      <Crown position="-0.118 3.908 -7.022" />

      <a-text
        id="player-winner"
        position="0.024 3.2 -7"
        color="#3737DD"
        wrap-count="15"
        text={`width:6; align:center; value: ${gameStore.leaderName ? gameStore.leaderName : 'Winner'}`}
        font="https://cdn.aframe.io/fonts/KelsonSans.fnt"
      />

      <a-text
        id="player-winner--text"
        position="-0.033 2.556 -7"
        color="#d1b390"
        wrap-count="35"
        text="width:6; align:center; value: Won The Game"
        font="https://cdn.aframe.io/fonts/KelsonSans.fnt"
      />
    </Fragment>
  );
};

Winner.propTypes = {
  gameStore: PropTypes.object.isRequired,
};

export default inject('gameStore')(observer(Winner));
