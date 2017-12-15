import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import Screen from './index.jsx';

const ScreenRoomJoin = ({ dataChannelStore }) => {
  const handleJoinRoom = event => {
    event.preventDefault();

    dataChannelStore.joinRoom();
  };

  return (
    <Screen name="roomJoin" className="around">
      <header className="hide">
        <h2>Joining Room</h2>
      </header>
      <div className="section__content">
        <div className="title">
          You&#39;re about to join the{' '}
          <form className="blobs" autoComplete="off" onSubmit={handleJoinRoom}>
            <input
              className="input stroke input--text input--stroke input--underline"
              type="text"
              autoFocus
              placeholder="room name"
              onChange={dataChannelStore.updateRoomName}
              autoCorrect="off"
              autoCapitalize="off"
            />
          </form>{' '}
          room
        </div>
      </div>
      <div className="btn-wrapper">
        <button className="btn" onClick={handleJoinRoom}>
          Join Room
        </button>
      </div>
    </Screen>
  );
};

ScreenRoomJoin.propTypes = {
  dataChannelStore: PropTypes.object.isRequired,
};

export default inject('dataChannelStore')(observer(ScreenRoomJoin));
