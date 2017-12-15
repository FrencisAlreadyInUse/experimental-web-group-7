/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';

import Screen from './Screen.jsx';

const ScreenWaiting = () => (
  <Screen name="waiting" className="around">
    <header className="hide">
      <h2>Player Setup</h2>
    </header>
    <div className="section__content flex column column-center">
      <div className="title">
        Waiting for your friends
      </div>
    </div>
  </Screen>
);

export default ScreenWaiting;
