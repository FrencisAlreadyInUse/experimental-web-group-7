import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import Screen from './Screen.jsx';

const ScreenRoomJoin = ({ setupStore }) => {
  let $input;

  const handleJoinRoom = event => {
    event.preventDefault();

    setupStore.joinRoom();
  };

  if (setupStore.sections.roomJoin.active) {
    setTimeout(() => {
      $input.focus();
    }, 500);
  }

  return (
    <Screen name="roomJoin" className="around">
      <header className="hide">
        <h1>Joining Room</h1>
      </header>
      <div className="section__content">
        <h2 className="title">
            You&#39;re about to join the{' '}
          <form className="blobs" autoComplete="off" onSubmit={handleJoinRoom}>
            <input
              className="input stroke input--text input--stroke input--underline"
              type="text"
              placeholder="room name"
              onChange={setupStore.updateRoomName}
              autoCorrect="off"
              autoCapitalize="off"
              ref={el => $input = el}
            />
          </form>{' '}
            room
        </h2>
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
  setupStore: PropTypes.object.isRequired,
};

export default inject('setupStore')(observer(ScreenRoomJoin));
