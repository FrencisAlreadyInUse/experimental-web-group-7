import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';

import Screen from './index.jsx';

const Waiting = styled.div`
  margin-top: 140px;
`;

const ScreenRoomJoined = ({ channelStore }) => (
  <Screen name="roomJoined" className="around">
    <header className="hide">
      <h2>Joined Room</h2>
    </header>
    <div className="section__content flex column column-center">
      <div className="title">
        You&#39;ve joined the <span className="stroke blobs">{channelStore.room.name}</span> room
      </div>
      <Waiting className="title--small">
        Waiting for more player(s)
      </Waiting>
    </div>
  </Screen>
);

ScreenRoomJoined.propTypes = {
  channelStore: PropTypes.object.isRequired,
};

export default inject('channelStore')(observer(ScreenRoomJoined));
