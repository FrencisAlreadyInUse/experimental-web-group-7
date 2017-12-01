import DataChannel from './lib/DataChannel';
import thumbDataURI from './lib/thumbDataURI';

let datachannel = null;
let createdRoomName = '';
let createdRoomSize = 0;

// buttons
const $buttonNavigatePageCreateRoom = document.querySelector('.btn--goto-create-room');
const $buttonNavigatePageJoinRoom = document.querySelector('.btn--goto-join-room');

const $buttonJoinRoom = document.querySelector('.btn--join-room');
const $buttonOpenRoom = document.querySelector('.btn--open-room');
const $buttonReady = document.querySelector('.btn--ready');
const $buttonPlay = document.querySelector('.btn--lets-play');

// targets
const $targetRoomNames = Array.from(document.querySelectorAll('.target--room-name'));
const $targetRoomSizes = Array.from(document.querySelectorAll('.target--room-size'));

// inputs
const $inputRoomSize = document.querySelector('.input--room-size');
const $inputRoomName = document.querySelector('.input--room-name');
const $inputUserName = document.querySelector('.input--user-name');

// TODO: change naming to be inline with rest of classes
// const $inputUserPictureWrapper = document.querySelector('.file-upload-wrapper');
const $inputUserPicture = document.querySelector('.input--user-picture');

// pages
const $pageLanding = document.querySelector('.landing');
const $pageCreateRoom = document.querySelector('.room--create');
const $pageCreateRoomDone = document.querySelector('.room--created');
const $pageJoinRoom = document.querySelector('.room--joining');
const $pageJoinRoomDone = document.querySelector('.room--joined');

const $main = document.querySelector('.main');
// const $pagePlayerSetup = document.querySelector('.player-setup');

// MOVE TO USER INFO PAGE
//
// $pageJoinRoomDone.classList.add('section--slide-out');
// $pageCreateRoomDone.classList.add('section--slide-out');

// $pagePlayerSetup.classList.add('section--slide-in');
// $inputUserPicture.addEventListener('change', handlePictureOnChange);

// UPDATE USER PICTURE NAME
//
// const handlePictureOnChange = (e) => {
//   const imagePth = e.path[0].files[0].name;
//   const $inputUserPictureWrapper = document.querySelector('.file-upload-wrapper');
//   $inputUserPictureWrapper.dataset.text = imagePath;
// };

const $deferredScripts = Array.from(document.querySelectorAll('.deferredScript'));

const log = {
  blue: (l, ...d) => console.log(`%c ${l} `, 'background:dodgerblue;color:white', ...d),
  red: (l, ...d) => console.log(`%c ${l} `, 'background:red;color:white', ...d),
  green: (l, ...d) => console.log(`%c ${l} `, 'background:yellowgreen;color:white', ...d),
  orange: (l, ...d) => console.log(`%c ${l} `, 'background:orange;color:white', ...d),
};

const channelOnRoomError = (event) => {
  log.orange('WARN', event.detail.message);
};

const handleCreateRoomSuccess = (event) => {
  const name = event.detail.room.name;

  log.blue('LOG', `Successfully created and joined the "${name}" room`);

  // set room name global
  createdRoomName = name;
  // update the room name fields with the correct room name
  $targetRoomNames.forEach(($item) => {
    $item.textContent = createdRoomName;
  });

  $pageLanding.classList.add('section--slide-out');

  // navigate to "about to create room" page
  $pageCreateRoom.classList.add('section--slide-in');
};

const handleJoinRoomSuccess = (event) => {
  const name = event.detail.room.name;

  log.blue('LOG', `Successfully joined the "${name}" room`);

  // set room name global
  createdRoomName = name;
  // update the room name fields with the correct room name
  $targetRoomNames.forEach(($item) => {
    $item.textContent = createdRoomName;
  });

  // navigate to "joined coom" page
  $pageJoinRoom.classList.add('section--slide-out');
  $pageJoinRoomDone.classList.add('section--slide-in');
};

const handleOpenRoomSuccess = (event) => {
  const name = event.detail.room.name;

  log.blue('LOG', `Successfully opened the "${name}" room`);

  // set room amount global
  createdRoomSize = $inputRoomSize.value;
  // update the room size fields with the correct room size
  $targetRoomSizes.forEach(($item) => {
    $item.textContent = createdRoomSize;
  });

  // navigate
  $pageCreateRoom.classList.add('section--slide-out');
  $pageCreateRoomDone.classList.add('section--slide-in');
};

const channelOnRoomSuccess = (event) => {
  const action = event.detail.action;

  if (action === 'created') handleCreateRoomSuccess(event);
  if (action === 'joined') handleJoinRoomSuccess(event);
  if (action === 'opened') handleOpenRoomSuccess(event);
};

const channelOnStateChange = (event) => {
  const state = event.detail.state;
  const peerId = event.detail.connection.peerId;

  if (state === 'open') log.green('CONNECTION', `established with ${peerId}`);
  if (state === 'close') log.red('DISCONNECTION', `from ${peerId}`);
};

const channelOnPeerUpdate = (event) => {
  const peerId = event.detail.peer.id;
  const peerName = event.detail.peer.name;

  log.blue('LOG', `got update from peer ${peerId} name: ${peerName}`);
};

const handleButtonReadyClick = () => {
  const userName = $inputUserName.value;
  const userPicture = $inputUserPicture.files[0];

  if (!userName || userName === '' || !userPicture) return;

  thumbDataURI(userPicture)
    .then(uri => datachannel.signalReady(userName, uri))
    .catch(log.red('ERROR', 'Something went wrong creating the userPicture.'));
};

const handleButtonJoinClick = () => {
  const roomName = $inputRoomName.value;
  if (!roomName || roomName === '') return;

  datachannel.joinRoom(roomName);
};

const handleInputRoomNameKeyDown = (event) => {
  if (event.keyCode !== 13) return;
  handleButtonJoinClick();
};

const channelOnGameStart = () => {
  $deferredScripts.forEach(($script) => {
    const src = $script.dataset.src;
    $script.src = src;
  });

  $main.classList.add('dp-n');

  const $aframeScene = document.querySelector('a-scene');
  $aframeScene.classList.add('section--slide-in');
};

const handleNavigateToPageJoin = () => {
  $pageLanding.classList.add('section--slide-out');
  $pageJoinRoom.classList.add('section--slide-in');
  window.setTimeout(() => {
    $inputRoomName.focus();
  }, 600);
};

const handleButtonOpenRoomClick = () => {
  // we'll navigate once we get the message that we
  // actually opened the room in channelOnRoomSuccess handler
  datachannel.openRoom(createdRoomName);
};

const handleButtonPlayClick = () => {
  //
  // go to the game
};

const handleNavigateToPageCreate = () => {
  // we'll navigate once we get the room name in channelOnRoomSuccess handler
  datachannel.createRoom();
};

const initDataChannel = () => {
  datachannel = new DataChannel();

  datachannel.addEventListener('roomError', channelOnRoomError);
  datachannel.addEventListener('roomSuccess', channelOnRoomSuccess);
  datachannel.addEventListener('dataChannelStateChange', channelOnStateChange);
  datachannel.addEventListener('peerUpdate', channelOnPeerUpdate);
  datachannel.addEventListener('gameStart', channelOnGameStart);
};

const setEventListeners = () => {
  $buttonNavigatePageCreateRoom.addEventListener('click', handleNavigateToPageCreate);
  $buttonNavigatePageJoinRoom.addEventListener('click', handleNavigateToPageJoin);
  $buttonJoinRoom.addEventListener('click', handleButtonJoinClick);
  $buttonReady.addEventListener('click', handleButtonReadyClick);
  $inputRoomName.addEventListener('keydown', handleInputRoomNameKeyDown);
  $buttonOpenRoom.addEventListener('click', handleButtonOpenRoomClick);
  $buttonPlay.addEventListener('click', handleButtonPlayClick);
};

const init = () => {
  initDataChannel();
  setEventListeners();

  window.peers = datachannel.peers;
  window.send = datachannel.sendMessage;
};

init();
