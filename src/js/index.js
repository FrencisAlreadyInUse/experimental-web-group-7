import DataChannel from './lib/DataChannel';
import thumbDataURI from './lib/thumbDataURI';

let datachannel = null;

// const currentSection = 0;

const $buttonCreateRoom = document.querySelector('.btn_goto-create-room');
const $buttonGoToJoinRoom = document.querySelector('.btn_goto-join-room');
const $targetRoomName = document.querySelector('.target_room-name');
const $inputRoomName = document.querySelector('.input_room-name');
const $buttonJoinRoom = document.querySelector('.button_join-room');

const $inputUserName = document.querySelector('.input_user-name');
const $inputUserPicture = document.querySelector('.input_user-picture');
const $readyButton = document.querySelector('.button_ready');

const $landingScreen = document.querySelector('.landing');
const $createScreen = document.querySelector('.room--create');
const $createdScreen = document.querySelector('.room--created');
const $playerSetup = document.querySelector('.player-setup');
const $joiningScreen = document.querySelector('.room--joining');
const $joinedScreen = document.querySelector('.room--joined');

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

    $readyButton.addEventListener('click', datachannel.startGame);
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

const handlePictureOnChange = (e) => {
  const imagePath = e.path[0].files[0].name;
  const $playerPictureWrapper = document.querySelector('.file-upload-wrapper');
  $playerPictureWrapper.dataset.text = imagePath;
};


const onPlayerSetup = () => {
  $joinedScreen.classList.add('section--slide-out');
  $createdScreen.classList.add('section--slide-out');

  $playerSetup.classList.add('section--slide-in');

  const $playerPicute = document.querySelector('.input_user-picture');
  $playerPicute.addEventListener('change', handlePictureOnChange);
};

const onJoinRoom = () => {
  $joiningScreen.classList.add('section--slide-out');
  $joinedScreen.classList.add('section--slide-in');

  const roomName = $inputRoomName.value;
  if (!roomName || roomName === '') return;
  datachannel.joinRoom(roomName);

  // generate button when all players have joined
  const $btnWrapper = document.createElement('div');
  $btnWrapper.classList.add('dp-f', 'ff-rnw', 'jc-c', 'btn-wrapper');
  const $btn = document.createElement('button');
  $btn.classList.add('dp-f', 'btn', 'btn--setup-user');
  $btn.textContent = 'Let\'s Play';

  $btnWrapper.appendChild($btn);
  $joinedScreen.appendChild($btnWrapper);

  $btn.addEventListener('click', onPlayerSetup);
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

const onPrepareJoin = () => {
  $landingScreen.classList.add('section--slide-out');
  $joiningScreen.classList.add('section--slide-in');
  $buttonJoinRoom.addEventListener('click', onJoinRoom);
};

const onOpenRoom = () => {
  $createScreen.classList.add('section--slide-out');

  // set joining for room on true
  $createdScreen.classList.add('section--slide-in');

  const $btnLetsPlay = document.querySelector('.btn--lets-play');
  $btnLetsPlay.addEventListener('click', onPlayerSetup);
};

const onCreateRoom = () => {
  $createScreen.classList.add('section--slide-in');

  $landingScreen.classList.add('section--slide-out');

  const $btnOpenRoom = document.querySelector('.btn--open-room');
  $btnOpenRoom.addEventListener('click', onOpenRoom);

  datachannel.createRoom();
};

const initDataChannel = () => {
  datachannel = new DataChannel();

  $buttonGoToJoinRoom.addEventListener('click', onPrepareJoin);
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
