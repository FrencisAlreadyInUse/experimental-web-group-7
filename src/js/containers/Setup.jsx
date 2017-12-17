import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Provider, observer } from 'mobx-react';

import About from './../components/Setup/About.jsx';
import Start from './../components/Setup/Start.jsx';
import Create from './../components/Setup/RoomCreate.jsx';
import Created from './../components/Setup/RoomCreated.jsx';
import Join from './../components/Setup/RoomJoin.jsx';
import Joined from './../components/Setup/RoomJoined.jsx';
import UserData from './../components/Setup/UserData.jsx';
import Waiting from './../components/Setup/Waiting.jsx';

const Setup = ({ setupStore }) => (
  <Provider setupStore={setupStore}>
    <Fragment>
      <header className="main__header hide">
        <h1 className="main-title">Virtual Lanes — VR Bowling Game</h1>
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
