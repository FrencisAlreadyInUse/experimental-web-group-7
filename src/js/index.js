import RTC from './lib/RTC';

const onMessage = (message) => {
  console.log('%c MESSAGE ', 'background: green; color: white', message);
};

const init = () => {
  //
  const RTCOptions = {
    requestConnectionButton: document.querySelector('#request-connection'),
    receiveMessageHandler: onMessage,
  };

  let DataChannel = null;

  try {
    DataChannel = new RTC(RTCOptions);
    window.send = DataChannel.send;
  } catch (error) {
    console.error(error);
  }
};

init();
