import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import Screen from './index.jsx';

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

const ScreenRoomCreated = ({ dataChannelStore }) => (
  <Screen name="roomCreated" className="around">
    <header className="hide">
      <h2>Created Room</h2>
    </header>
    <div className="section__content flex column column-center">
      <div className="title">
        You&#39;ve just created the{' '}
        <span className="input stroke input--stroke blobs">{dataChannelStore.room.name}</span> room for{' '}
        <span className="input stroke input--stroke blob">{dataChannelStore.room.size}</span> players
      </div>
      <Share className="title--small">
        Share this <span className="stroke">room name</span> with friends!
      </Share>
      <Waiting className="title--small">
        <span className="stroke">
          <span>{dataChannelStore.room.userCount}</span> / <span>{dataChannelStore.room.size}</span>{' '}
        </span>
        <span>players joined</span>
      </Waiting>
    </div>
    <div className="btn-wrapper">
      <button className="btn" onClick={dataChannelStore.registeredRoom}>
        Let&#39;s Play
      </button>
    </div>
  </Screen>
);

ScreenRoomCreated.propTypes = {
  dataChannelStore: PropTypes.object.isRequired,
};

export default inject('dataChannelStore')(observer(ScreenRoomCreated));
