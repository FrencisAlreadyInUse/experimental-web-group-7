import DataChannel from './lib/DataChannel';
import thumbDataURI from './lib/thumbDataURI';

let datachannel = null;

// const currentSection = 0;

const $buttonCreateRoom = document.querySelector('.button_goto-create-room');
const $targetRoomName = document.querySelector('.target_room-name');
const $inputRoomName = document.querySelector('.input_room-name');
const $buttonJoinRoom = document.querySelector('.button_join-room');

const $inputUserName = document.querySelector('.input_user-name');
const $inputUserPicture = document.querySelector('.input_user-picture');
const $readyButton = document.querySelector('.button_ready');

const $scripts = Array.from(document.querySelectorAll('.deferredStyle'));

const log = {
  blue: (l, ...d) => console.log(`%c ${l} `, 'background:#1e90ff;color:#ff711e', ...d),
  red: (l, ...d) => console.log(`%c ${l} `, 'background:#ff0000;color:#00ff00', ...d),
  green: (l, ...d) => console.log(`%c ${l} `, 'background:yellowgreen;color:white', ...d),
  orange: (l, ...d) => console.log(`%c ${l} `, 'background:orange;color:white', ...d),
};

const onRoomError = (event) => {
  log.orange('WARN', event.detail.message);
};

const onRoomSuccess = (event) => {
  const action = event.detail.action === 'created' ? 'created and joined' : 'joined';
  const name = event.detail.room.name;
  console.log('[onRoomSucces — name]', name);

  if (event.detail.action === 'created') {
    $targetRoomName.textContent = name;

    // start knop genereren en in pagina zetten
    // $button.addEventListener('click', datachannel.startGame)
  }

  $inputRoomName.disabled = true;
  $buttonCreateRoom.disabled = true;
  $buttonJoinRoom.disabled = true;

  log.blue('LOG', `Successfully ${action} the "${name}" room`);
};

const onStateChange = (event) => {
  const state = event.detail.state;
  const peerId = event.detail.connection.peerId;

  if (state === 'open') log.green('CONNECTION', `established with ${peerId}`);
  if (state === 'close') log.red('DISCONNECTION', `from ${peerId}`);
};

const onPeerUpdate = (event) => {
  log.blue('LOG', `got update from peer ${event.detail.peer.id} name: ${event.detail.peer.name}`);
};

const onReady = () => {
  const name = $inputUserName.value;
  const picture = $inputUserPicture.files[0];

  if (!name || name === '' || !picture) return;

  thumbDataURI(picture).then(uri => datachannel.signalReady(name, uri));
};

const onJoinRoom = () => {
  const roomName = $inputRoomName.value;
  if (!roomName || roomName === '') return;
  datachannel.joinRoom(roomName);
};

const onKeyDown = (event) => {
  if (event.keyCode !== 13) return;
  onJoinRoom();
};

const onGameStart = () => {
  $scripts.forEach(($script) => {
    const src = $script.dataset.src;
    $script.src = src;
  });
};

const onCreateRoom = () => {
  // naar pagina scrollen
  // andere shizzle (spinnerke)

  datachannel.createRoom();
};

const initDataChannel = () => {
  datachannel = new DataChannel();

  $buttonJoinRoom.addEventListener('click', onJoinRoom);
  $inputRoomName.addEventListener('keydown', onKeyDown);
  $buttonCreateRoom.addEventListener('click', onCreateRoom);
  $readyButton.addEventListener('click', onReady);

  datachannel.on('roomError', onRoomError);
  datachannel.on('roomSuccess', onRoomSuccess);
  datachannel.on('dataChannelStateChange', onStateChange);
  datachannel.on('peerUpdate', onPeerUpdate);
  datachannel.on('gameStart', onGameStart);
};

const loadScripts = () => {
  $scripts.forEach(($script) => {
    const $tempScript = document.createElement('script');
    const src = $script.dataset.src;
    $tempScript.src = src;
  });
};

const init = () => {
  initDataChannel();
  loadScripts();

  window.peers = datachannel.peers;
  window.send = datachannel.sendMessage;
};

init();
