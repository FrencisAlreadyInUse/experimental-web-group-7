const logRouteFileName = require('./lib/logRouteFileName');

module.exports.name = 'routes';
module.exports.version = '1.0.0';

module.exports.register = async (server, options) => {
  const { files } = options;

  if (!files) throw new Error('routes plugin needs a "files" array to load routes from.');

  files.forEach((file) => {
    logRouteFileName(file);
    server.route(require(file));
  });
  console.log('');
};
