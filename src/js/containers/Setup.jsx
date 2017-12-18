import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Provider, observer } from 'mobx-react';

import About from './../components/Setup/Screens/About.jsx';
import Start from './../components/Setup/Screens/Start.jsx';
import Create from './../components/Setup/Screens/RoomCreate.jsx';
import Created from './../components/Setup/Screens/RoomCreated.jsx';
import Join from './../components/Setup/Screens/RoomJoin.jsx';
import Joined from './../components/Setup/Screens/RoomJoined.jsx';
import UserData from './../components/Setup/Screens/UserData.jsx';
import Waiting from './../components/Setup/Screens/Waiting.jsx';

const Setup = ({ setupStore }) => (
  <Provider setupStore={setupStore}>
    <Fragment>
      <header className="main__header hide">
        <h1 className="main-title">Virtual Lanes — Setup</h1>
      </header>
      <Start />
      <About />
      <Create />
      <Created />
      <Join />
      <Joined />
      <UserData />
      <Waiting />
    </Fragment>
  </Provider>
);

Setup.propTypes = {
  setupStore: PropTypes.object.isRequired,
};

export default observer(Setup);
