const chalk = require('chalk');
const log = require('fancy-log');

const handlersGenerator = require('./handlers');

const users = {};

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
    users,
    serverSocket,
    clientSocket,
    ss,
    cs,
  });

  users[clientSocket.id] = { peers: [] };

  log(`[${chalk.blue('SIGNALING-SERVER')}] ↓ received "${chalk.yellow('connect')}" from "${chalk.yellow(clientSocket.id)}"`);

  // cs.air('peerConnection', clientSocket.id);

  cs.on('peerWantsACall', handlers.peerWantsACall);
  cs.on('peerIce', handlers.peerIce);
  cs.on('peerAnswer', handlers.peerAnswer);
  cs.on('peerOffer', handlers.peerOffer);
  cs.on('disconnect', handlers.disconnect);

  ss.to(clientSocket.id, 'users', users);
};
