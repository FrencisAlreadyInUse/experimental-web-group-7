/* eslint-disable react/jsx-filename-extension */

import React from 'react';
import { render } from 'react-dom';

import DataChannel from './classes/DataChannel.js';
import DataChannelStore from './classes/stores/DataChannelStore.js';
import App from './components/App.jsx';
import Game from './classes/Game.js';

const $deferredScripts = Array.from(document.getElementsByClassName('deferred-script'));
const $reactMount = document.querySelector('.react-mount');
let gameLoaded = false;

const loadGame = () => {
  $deferredScripts.forEach($script => {
    $script.src = $script.dataset.src;
  });
  console.log('scripts loaded');
  gameLoaded = true;
};

const startGame = () => {
  if (!gameLoaded) loadGame();

  document.body.removeChild($reactMount);
};

const init = () => {
  const dataChannel = new DataChannel();
  const dataChannelStore = new DataChannelStore(dataChannel);

  dataChannel
    .on('dataChannelLoadGame', loadGame)
    .on('dataChannelStartGame', startGame);

  /* prettier-ignore */
  render(
    <App dataChannelStore={dataChannelStore} />,
    $reactMount,
  );

  const game = new Game(dataChannel);

  if (process.env.NODE_ENV === 'development') {
    window.channel = dataChannel;
    window.ss = dataChannel.signalingServer;
    window.store = dataChannelStore;
    window.game = game;
    window.start = startGame;
  }
};

init();
