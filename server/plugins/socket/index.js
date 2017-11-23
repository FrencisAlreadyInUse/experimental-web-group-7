const SocketIO = require(`socket.io`);

const emit = require(`./lib/emit`);
const on = require(`./lib/on`);

module.exports.name = `socket`;
module.exports.version = `1.0.0`;

module.exports.register = server => {
  const socket = SocketIO(server.listener);

  socket.on(`connection`, socket => {
    emit(socket, `Oh Hii!`, {id: socket.client.id});
    on(socket, `burp`, () =>
      emit(socket, `Nooooope`, {to: socket.client.id, message: `Excuse You!`})
    );
  });
};
