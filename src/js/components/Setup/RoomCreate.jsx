import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import wait from './../../functions/wait.js';

import Screen from './Screen.jsx';
import RoomSize from './RoomSize.jsx';

const ScreenRoomCreate = ({ setupStore }) => {
  let $input;

  if (setupStore.sections.roomCreate.active) {
    wait(500, () => {
      if ($input) $input.focus();
    });
  }

  return (
    <Screen name="roomCreate" className="around">
      <header className="hide">
        <h1>Create Room</h1>
      </header>
      <div className="section__content">
        <h2 className="title">
          <span>You&#39;re about to create the </span>
          <span className="stroke blobs">{setupStore.room.name}</span>
          <span> room for <RoomSize min={2} max={5} /></span>
          <span>players</span>
        </h2>
      </div>
      <div className="btn-wrapper">
        <button className="btn" onClick={setupStore.openRoom}>
          Open Room
        </button>
      </div>
    </Screen>
  );
};

ScreenRoomCreate.propTypes = {
  setupStore: PropTypes.object.isRequired,
};

export default inject('setupStore')(observer(ScreenRoomCreate));
