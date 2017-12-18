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

  if (enableLogging) {
    log(
      `[${chalk.blue('SIGNALING-SERVER')}] ↓ received "${chalk.yellow(
        'connect',
      )}" from "${chalk.yellow(clientSocket.id)}"`,
    );
  }

  // start listening to events */

  cs.on('createRoom', handlers.handleCreateRoom);
  cs.on('joinRoom', handlers.handleJoinRoom);
  cs.on('openRoom', handlers.handleOpenRoom);
  cs.on('roomFull', handlers.handleRoomFull);
  cs.on('userReady', handlers.handleUserReady);

  cs.on('peerOffer', handlers.handlePeerOffer);
  cs.on('peerAnswer', handlers.handlePeerAnswer);
  cs.on('peerIce', handlers.handlePeerIce);

  cs.on('disconnect', handlers.handleDisconnect);
};
