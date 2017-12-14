import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import Screen from './index.jsx';

const ScreenRoomCreate = ({ dataChannelStore }) => (
  <Screen name="roomCreate" className="around">
    <header className="hide">
      <h2>Create Room</h2>
    </header>
    <div className="section__content">
      <div className="title">
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
          />
        </span>
        <span>players</span>
      </div>
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
