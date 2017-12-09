import React from 'react';
import { Provider, observer } from 'mobx-react';

import channelStore from './../stores/channelStore.js';
import Start from './Screens/Start.jsx';
import Create from './Screens/RoomCreate.jsx';
import Created from './Screens/RoomCreated.jsx';
import Join from './Screens/RoomJoin.jsx';
import Joined from './Screens/RoomJoined.jsx';
import UserData from './Screens/UserData.jsx';

const App = () => (
  <Provider channelStore={channelStore}>
    <div className="wrapper">
      <Start />
      <Create />
      <Created />
      <Join />
      <Joined />
      <UserData />
    </div>
  </Provider>
);

export default observer(App);
