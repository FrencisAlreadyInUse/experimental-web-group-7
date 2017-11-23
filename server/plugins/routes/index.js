const Path = require(`path`);
const glob = require(`glob-promise`);

const logRouteFileRoutes = require(`./lib/logRouteFileRoutes`);
const routeFilesFilter = require(`./lib/routeFileFilter`);
const logRouteFileName = require(`./lib/logRouteFileName`);

module.exports.name = `routes`;
module.exports.version = `1.0.0`;

module.exports.register = async (server, options) => {
  const {directory} = options;

  if (!directory)
    throw new Error(`register-routes needs a directory to load routes from.`);

  /* prettier-ignore */
  const files = await glob(
    Path.join(directory, `**/*.js`),
    {ignore: [`**/*/index.js`, `**/*/_*.js`]}
  ).catch(err => console.error(err));

  files.filter(routeFilesFilter).forEach(file => {
    console.log(``);
    logRouteFileName(file);

    const routes = require(file);
    server.route(routes);

    logRouteFileRoutes(routes);
    console.log(``);
  });
};
