const Path = require(`path`);
const {promisify} = require(`util`);
const readFile = promisify(require(`fs`).readFile);
const Hapi = require(`hapi`);
const Inert = require(`inert`);
const dotenv = require(`dotenv`);
const chalk = require(`chalk`);

const Socket = require(`./plugins/socket`);
const Routes = require(`./plugins/routes`);

dotenv.config();

const report = error => console.log(`${chalk.red(`[ ERROR ]`)}`, error);
const done = serverUri => console.log(`Server running at:`, `${chalk.red(serverUri)}\n`); /* prettier-ignore */
const read = file => readFile(Path.join(__dirname, file), `utf8`).catch(report);
const development = process.env.NODE_ENV === `development`;

const init = () =>
  
  new Promise(async resolve => {
    
    const host = process.env.HOST || `localhost`;
    const port = process.env.PORT || 3000;

    const serverOptions = {
      host,
      port,
      routes: {
        files: {
          relativeTo: Path.join(__dirname, `public`)
        }
      }
    };

    if (development) {
      const key = await read(`config/sslcerts/key.pem`);
      const cert = await read(`config/sslcerts/cert.pem`);

      serverOptions[`tls`] = {key, cert};
    }

    const server = new Hapi.Server(serverOptions);

    await server.register(Inert);

    await server.register(Socket);

    await server.register({
      plugin: Routes,
      options: {directory: Path.join(__dirname, `routes`)}
    });

    await server.start();

    resolve(`https://${host}:${port}`);
  });

init()
  .then(done)
  .catch(report);
