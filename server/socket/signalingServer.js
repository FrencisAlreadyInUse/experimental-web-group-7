const chalk = require('chalk');
const log = require('fancy-log');

const handlersGenerator = require('./handlers');
const Store = require('./classes/Store');

const store = new Store();

module.exports = (
  server,
  serverSocket,
  clientSocket,
  serverSocketHelperGenerator,
  clientSocketHelperGenerator,
  enableLogging,
) => {
  //
  const label = `[${chalk.blue('SIGNALING-SERVER')}]`;
  const ss = serverSocketHelperGenerator({ socket: serverSocket, label, enableLogging });
  const cs = clientSocketHelperGenerator({ socket: clientSocket, label, enableLogging });

  const handlers = handlersGenerator({
    store,
    serverSocket,
    clientSocket,
    ss,
    cs,
  });

  if (enableLogging) log(`[${chalk.blue('SIGNALING-SERVER')}] ↓ received "${chalk.yellow('connect')}" from "${chalk.yellow(clientSocket.id)}"`);

  cs.on('createRoom', handlers.createRoom);
  cs.on('joinRoom', handlers.joinRoom);
  cs.on('openRoom', handlers.openRoom);
  cs.on('roomFull', handlers.roomFull);
  cs.on('userReady', handlers.userReady);

  cs.on('peerOffer', handlers.peerOffer);
  cs.on('peerAnswer', handlers.peerAnswer);
  cs.on('peerIce', handlers.peerIce);

  cs.on('disconnect', handlers.disconnect);
};
