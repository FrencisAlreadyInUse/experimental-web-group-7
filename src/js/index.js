import DataChannel from './lib/DataChannel';
import thumbDataURI from './lib/thumbDataURI';

let datachannel = null;

const $buttonCreateRoom = document.querySelector('.button_create-room');
const $targetRoomName = document.querySelector('.target_room-name');
const $inputRoomName = document.querySelector('.input_room-name');
const $buttonJoinRoom = document.querySelector('.button_join-room');

const $inputUserName = document.querySelector('.input_user-name');
const $inputUserPicture = document.querySelector('.input_user-picture');
const $readyButton = document.querySelector('.button_ready');

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

  if (event.detail.action === 'created') {
    $targetRoomName.textContent = name;
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

const initDataChannel = () => {
  datachannel = new DataChannel();

  $buttonJoinRoom.addEventListener('click', onJoinRoom);
  $inputRoomName.addEventListener('keydown', onKeyDown);
  $buttonCreateRoom.addEventListener('click', datachannel.createRoom);
  $readyButton.addEventListener('click', onReady);

  datachannel.on('roomError', onRoomError);
  datachannel.on('roomSuccess', onRoomSuccess);
  datachannel.on('dataChannelStateChange', onStateChange);
  datachannel.on('peerUpdate', onPeerUpdate);
};

const init = () => {
  initDataChannel();

  window.peers = datachannel.peers;
  window.send = datachannel.sendMessage;
};

init();
