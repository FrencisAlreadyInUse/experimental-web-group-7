/* eslint-disable react/jsx-filename-extension */

import React from 'react';
import { render } from 'react-dom';

import DataChannel from './classes/DataChannel.js';
import DataChannelStore from './classes/stores/DataChannelStore.js';
import App from './components/App.jsx';
import Game from './classes/Game.js';

const init = () => {
  const dataChannel = new DataChannel();
  const dataChannelStore = new DataChannelStore(dataChannel);

  /* prettier-ignore */
  render(
    <App channelStore={dataChannelStore} />,
    document.querySelector('.react-mount'),
  );

  const game = new Game(dataChannel);

  window.channel = dataChannel;
  window.store = dataChannelStore;
  window.game = game;
};

init();
