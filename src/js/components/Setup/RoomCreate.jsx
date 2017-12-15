import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import Screen from './Screen.jsx';

const ScreenRoomCreate = ({ setupStore }) => (
  <Screen name="roomCreate" className="around">
    <header className="hide">
      <h2>Create Room</h2>
    </header>
    <div className="section__content">
      <div className="title">
        <span>You&#39;re about to create the </span>
        <span className="stroke blobs">{setupStore.room.name}</span>
        <span> room for </span>
        <span className="blob">
          <input
            className="input stroke input--stroke"
            type="number"
            value={setupStore.room.size}
            min="2"
            max="5"
            onChange={setupStore.updateRoomSize}
          />
        </span>
        <span>players</span>
      </div>
    </div>
    <div className="btn-wrapper">
      <button className="btn" onClick={setupStore.openRoom}>
        Open Room
      </button>
    </div>
  </Screen>
);

ScreenRoomCreate.propTypes = {
  setupStore: PropTypes.object.isRequired,
};

export default inject('setupStore')(observer(ScreenRoomCreate));
