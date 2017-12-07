const io = require('socket.io');

const logSocketFileName = require('./lib/logSocketFileName');
const serverSocketHelperGenerator = require('./lib/helpers/serverSocketHelper');
const clientSocketHelperGenerator = require('./lib/helpers/clientSocketHelper');

module.exports.name = 'socket';
module.exports.version = '1.0.0';

module.exports.register = (server, options) => {
  const { files, enableLogging } = options;

  if (!files) throw new Error('socket plugin needs a "files" array to load socket files from.');

  const handlers = [];

  files.forEach((file) => {
    handlers.push(require(file));
    if (enableLogging) logSocketFileName(file);
  });
  if (enableLogging) console.log('');

  const serverSocket = io(server.listener);

  // load all socket files provided by the user
  serverSocket.on('connection', (clientSocket) => {
    handlers.forEach(handler =>
      handler(
        server,
        serverSocket,
        clientSocket,
        serverSocketHelperGenerator,
        clientSocketHelperGenerator,
        enableLogging,
      ));
  });
};
