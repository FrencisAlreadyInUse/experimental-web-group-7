/* eslint-disable react/jsx-filename-extension */

import React from 'react';
import { render } from 'react-dom';
import { toJS } from 'mobx';

import DataChannel from './classes/DataChannel.js';
import SetupStore from './stores/SetupStore.js';
import GameStore from './stores/GameStore.js';

import Setup from './containers/Setup.jsx';
import Game from './containers/Game.jsx';

const $deferredScripts = Array.from(document.getElementsByClassName('deferred-script'));
const $setupMount = document.querySelector('.setup-mount');
const $gameMount = document.querySelector('.game-mount');

let dataChannel;
let setupStore;
let gameStore;

const loadGame = () => {
  $deferredScripts.forEach($script => {
    $script.src = $script.dataset.src;
  });

  document.body.removeChild($setupMount);
};

const renderGame = () => {
  $gameMount.addEventListener('loaded', () => {
    gameStore.init();
  });

  render(<Game gameStore={gameStore} />, $gameMount, loadGame);
};

const renderSetup = () => {
  render(<Setup setupStore={setupStore} />, $setupMount);
};

const logSocketId = () => {
  console.log('%c socket id ', 'background:lightgreen', dataChannel.myId);
};

const logError = (...error) => {
  console.error('%c error ', 'background:pink', ...error);
};

const init = () => {
  dataChannel = new DataChannel();
  setupStore = new SetupStore(dataChannel);
  gameStore = new GameStore(dataChannel);

  renderSetup(setupStore);

  dataChannel
    .on('ssRoomUsersReady', renderGame)
    .on('dcSocketConnection', logSocketId)
    .on('dcError', logError);

  if (process.env.NODE_ENV === 'development') {
    window.start = renderGame;
    window.setupStore = setupStore;
    window.gameStore = gameStore;
    window.toJS = toJS;
  }
};

init();
