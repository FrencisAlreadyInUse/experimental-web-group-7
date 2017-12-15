import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';

import Screen from './index.jsx';

const Waiting = styled.div`
  margin-top: 140px;
`;

const ScreenRoomJoined = ({ dataChannelStore }) => (
  <Screen name="roomJoined" className="around">
    <header className="hide">
      <h1>Joined Room</h1>
    </header>
    <div className="section__content flex column column-center">
      <h2 className="title">
        You&#39;ve joined the <span className="stroke blobs">{dataChannelStore.room.name}</span> room
      </h2>
      <Waiting className="title--small">
        Waiting for more player(s)
      </Waiting>
    </div>
  </Screen>
);

ScreenRoomJoined.propTypes = {
  dataChannelStore: PropTypes.object.isRequired,
};

export default inject('dataChannelStore')(observer(ScreenRoomJoined));
