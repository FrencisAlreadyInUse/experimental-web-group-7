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

const loadGame = () => {
  $deferredScripts.forEach($script => {
    $script.src = $script.dataset.src;
  });

  document.body.removeChild($setupMount);
};

const renderGame = gameStore => {
  $gameMount.addEventListener('loaded', () => {
    gameStore.init();
  });

  render(<Game gameStore={gameStore} />, $gameMount, loadGame);
};

const renderSetup = setupStore => {
  render(<Setup setupStore={setupStore} />, $setupMount);
};

const init = () => {
  const dataChannel = new DataChannel();
  const setupStore = new SetupStore(dataChannel);
  const gameStore = new GameStore(dataChannel);

  renderSetup(setupStore);

  dataChannel.on('dataChannelStartGame', () => renderGame(gameStore));

  if (process.env.NODE_ENV === 'development') {
    window.start = () => renderGame(gameStore);
    window.setupStore = setupStore;
    window.gameStore = gameStore;
    window.toJS = toJS;
  }
};

init();
