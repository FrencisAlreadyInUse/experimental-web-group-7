import RTC from './lib/RTC';

const $buttonRequestConnection = document.querySelector('#button-request-connection');
const $buttonCreateRoom = document.querySelector('#button-create-room');
const $buttonJoinRoom = document.querySelector('#button-join-room');

const onMessage = (message) => {
  console.log('%c MESSAGE ', 'background: green; color: white', message);
};

const init = () => {
  //
  const RTCOptions = {
    requestConnectionButton: $buttonRequestConnection,
    createRoomButton: $buttonCreateRoom,
    receiveMessageHandler: onMessage,
  };

  let DataChannel = null;

  try {
    DataChannel = new RTC(RTCOptions);
    window.send = DataChannel.sendMessage;
  } catch (error) {
    console.error(error);
  }

  $buttonJoinRoom.addEventListener('click', () => {});
};

init();
