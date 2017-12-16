import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import Screen from './Screen.jsx';

const Share = styled.div`
  margin-top: 140px;

  @media only screen and (max-width: 768px) {
    margin-top: 7rem;
    text-align: center;
  }
`;

const Waiting = styled.div`
  margin-top: 70px;

  @media only screen and (max-width: 768px) {
    margin-top: 4.5rem;
    text-align: center;
  }
`;

const ScreenRoomCreated = ({ setupStore }) => (
  <Screen name="roomCreated" className="around">
    <header className="hide">
      <h1>Created Room</h1>
    </header>
    <div className="section__content flex column column-center">
      <h2 className="title">
        You&#39;ve just created the{' '}
        <span className="input stroke input--stroke blobs">{setupStore.room.name}</span> room for{' '}
        <span className="input stroke input--stroke blob">{setupStore.room.size}</span> players
      </h2>
      <Share className="title--small">
        Share this <span className="stroke">room name</span> with friends!
      </Share>
      <Waiting className="title--small">
        <span className="stroke">
          <span>{setupStore.room.userCount}</span> / <span>{setupStore.room.size}</span>{' '}
        </span>
        <span>players joined</span>
      </Waiting>
    </div>
    <div className="btn-wrapper">
      <button className="btn" onClick={setupStore.registeredRoom}>
        Let&#39;s Play
      </button>
    </div>
  </Screen>
);

ScreenRoomCreated.propTypes = {
  setupStore: PropTypes.object.isRequired,
};

export default inject('setupStore')(observer(ScreenRoomCreated));
