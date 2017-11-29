const Path = require('path');
const { promisify } = require('util');
const readFile = promisify(require('fs').readFile);
const Hapi = require('hapi');
const Inert = require('inert');
const dotenv = require('dotenv');
const chalk = require('chalk');
const log = require('fancy-log');

const Socket = require('./plugins/socket');
const Routes = require('./plugins/routes');

dotenv.config();

const report = error => log.error(`[${chalk.magenta('SERVER')}]`, error);
const done = serverUri => log(`[${chalk.magenta('SERVER')}] running at:`, `${chalk.blue(serverUri)}\n`); /* prettier-ignore */
const read = file => readFile(Path.join(__dirname, file), 'utf8').catch(report);
const development = process.env.NODE_ENV === 'development';
const _ = strings => Path.join(__dirname, strings[0]);

const init = () =>
  new Promise(async (resolve) => {
    const port = process.env.PORT || 3000;
    const host = process.env.HOST || 'localhost';

    const serverOptions = {
      port,
      routes: {
        files: {
          relativeTo: _`public`,
        },
      },
    };

    if (development) {
      const key = await read('config/sslcerts/key.pem');
      const cert = await read('config/sslcerts/cert.pem');

      serverOptions.tls = { key, cert };
      serverOptions.host = host;
    }

    const server = new Hapi.Server(serverOptions);

    await server.register(Inert);

    await server.register({
      plugin: Socket,
      options: {
        files: [_`socket/signalingServer.js`],
      },
    });

    await server.register({
      plugin: Routes,
      options: {
        files: [_`routes/static/public.js`],
      },
    });

    await server.start();

    resolve(`https://${host}:${port}`);
  });

init()
  .then(done)
  .catch(report);
