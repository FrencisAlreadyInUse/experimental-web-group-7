import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import Screen from './index.jsx';

const ScreenRoomCreate = ({ dataChannelStore }) => (
  <Screen name="roomCreate" className="around">
    <header className="hide">
      <h1>Create Room</h1>
    </header>
    <div className="section__content">
      <h2 className="title">
        <span>You&#39;re about to create the </span>
        <span className="stroke blobs">{dataChannelStore.room.name}</span>
        <span> room for </span>
        <span className="blob">
          <input
            className="input stroke input--stroke"
            type="number"
            value={dataChannelStore.room.size}
            min="2"
            max="5"
            onChange={dataChannelStore.updateRoomSize}
            autoFocus
          />
        </span>
        <span>players</span>
      </h2>
    </div>
    <div className="btn-wrapper">
      <button className="btn" onClick={dataChannelStore.openRoom}>
        Open Room
      </button>
    </div>
  </Screen>
);

ScreenRoomCreate.propTypes = {
  dataChannelStore: PropTypes.object.isRequired,
};

export default inject('dataChannelStore')(observer(ScreenRoomCreate));
