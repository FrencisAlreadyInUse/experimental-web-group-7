const chalk = require('chalk');
const log = require('fancy-log');

const handlersGenerator = require('./handlers');

const store = {
  maxRooms: 5,
  rooms: {
    // roomName: [
    //   userId, userId, userId, ...
    // ]
  },
  users: {
    // id: roonName
  },
};

module.exports = (
  server,
  serverSocket,
  clientSocket,
  serverSocketHelperGenerator,
  clientSocketHelperGenerator,
) => {
  //
  const label = `[${chalk.blue('SIGNALING-SERVER')}]`;
  const ss = serverSocketHelperGenerator({ socket: serverSocket, label });
  const cs = clientSocketHelperGenerator({ socket: clientSocket, label });

  const handlers = handlersGenerator({
    store,
    serverSocket,
    clientSocket,
    ss,
    cs,
  });

  log(`[${chalk.blue('SIGNALING-SERVER')}] ↓ received "${chalk.yellow('connect')}" from "${chalk.yellow(clientSocket.id)}"`);

  cs.on('createRoom', handlers.createRoom);

  cs.on('peerWantsACall', handlers.peerWantsACall);
  cs.on('peerOffer', handlers.peerOffer);
  cs.on('peerAnswer', handlers.peerAnswer);
  cs.on('peerIce', handlers.peerIce);

  cs.on('disconnect', handlers.disconnect);
};
