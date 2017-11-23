let socket;

const handleButtonClick = () => {
  socket.emit(`burp`);
};

const init = () => {
  socket = io();

  const $button = document.querySelector(`button`);
  $button.addEventListener(`click`, handleButtonClick);
};

init();
