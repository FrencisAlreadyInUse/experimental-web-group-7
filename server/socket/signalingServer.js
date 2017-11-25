const chalk = require('chalk');

const handlersGenerator = require('./handlers');

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

  const users = {};

  const handlers = handlersGenerator({
    users,
    serverSocket,
    clientSocket,
    ss,
    cs,
  });

  users[clientSocket.id] = { peers: [] };

  ss.to(clientSocket.id, 'connectionUrl', server.info.uri);
  ss.to(clientSocket.id, 'users', users);
  cs.air('peerConnection', clientSocket.id);

  ss.on('peerWantsACall', handlers.peerWantsACall);
  ss.on('peerOffer', handlers.peerOffer);
  ss.on('peerAnswer', handlers.peerAnswer);
  ss.on('peerIce', handlers.peerIce);

  ss.on('disconnect', () => {
    if (!users[clientSocket.id]) return;

    handlers.notifyPeersOfDisconnect(clientSocket.id);
    handlers.removePeerFromUsers(clientSocket.id);
  });
};
