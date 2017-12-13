import React from 'react';
import PropTypes from 'prop-types';
import { Provider, observer } from 'mobx-react';

import Start from './Screens/Start.jsx';
import Create from './Screens/RoomCreate.jsx';
import Created from './Screens/RoomCreated.jsx';
import Join from './Screens/RoomJoin.jsx';
import Joined from './Screens/RoomJoined.jsx';
import UserData from './Screens/UserData.jsx';

const App = ({ channelStore }) => (
  <Provider channelStore={channelStore}>
    <main className="wrapper">
      <header className="main__header">
        <h1 className="main-title hide">Virtual Lanes — VR Bowling Game</h1>
      </header>
      <Start />
      <Create />
      <Created />
      <Join />
      <Joined />
      <UserData />
    </main>
  </Provider>
);

App.propTypes = {
  channelStore: PropTypes.object.isRequired,
};

export default observer(App);
