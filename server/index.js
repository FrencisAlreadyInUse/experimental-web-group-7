const Path = require(`path`);
const Hapi = require(`hapi`);
const Inert = require(`inert`);

const Socket = require(`./plugins/socket`);
const Routes = require(`./plugins/routes`);

const server = new Hapi.Server({
  host: `localhost`,
  port: 3000,
  routes: {
    files: {
      relativeTo: Path.join(__dirname, `public`)
    }
  }
});

const init = async () => {
  //
  await server.register(Inert);

  await server.register(Socket);

  await server.register({
    plugin: Routes,
    options: {directory: Path.join(__dirname, `routes`)}
  });

  await server.start();
};

init()
  .then(() => console.log(`Server running at:`, server.info.uri))
  .catch(console.error);
