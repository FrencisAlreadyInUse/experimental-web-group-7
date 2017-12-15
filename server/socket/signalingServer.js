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

  const {
    handleCreateRoom,
    handleJoinRoom,
    handleOpenRoom,
    handleRoomFull,
    handleUserReady,
    handlePeerOffer,
    handlePeerAnswer,
    handlePeerIce,
    handleDisconnect,
  } = handlers;

  if (enableLogging) {
    log(
      `[${chalk.blue('SIGNALING-SERVER')}] ↓ received "${chalk.yellow(
        'connect',
      )}" from "${chalk.yellow(clientSocket.id)}"`,
    );
  }

  // start listening to events */

  cs.on('createRoom', handleCreateRoom);
  cs.on('joinRoom', handleJoinRoom);
  cs.on('openRoom', handleOpenRoom);
  cs.on('roomFull', handleRoomFull);
  cs.on('userReady', handleUserReady);

  cs.on('peerOffer', handlePeerOffer);
  cs.on('peerAnswer', handlePeerAnswer);
  cs.on('peerIce', handlePeerIce);

  cs.on('disconnect', handleDisconnect);
};
