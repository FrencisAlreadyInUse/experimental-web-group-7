import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import Screen from './index.jsx';

const ScreenRoomJoin = ({ channelStore }) => (
  <Screen name="roomJoin" className="around">
    <header className="hide">
      <h2>Joining Room</h2>
    </header>
    <div className="section__content">
      <div className="title">
        You&#39;re about to join the{' '}
        <form className="blobs" autoComplete="off">
          <input
            className="input stroke input--text input--stroke input--underline"
            type="text"
            placeholder="room name"
            onChange={channelStore.updateRoomName}
            autoCorrect="off"
            autoCapitalize="off"
          />
        </form>{' '}
        room
      </div>
    </div>
    <div className="btn-wrapper">
      <button className="btn" onClick={channelStore.joinRoom}>
        Join Room
      </button>
    </div>
  </Screen>
);

ScreenRoomJoin.propTypes = {
  channelStore: PropTypes.object.isRequired,
};

export default inject('channelStore')(observer(ScreenRoomJoin));
