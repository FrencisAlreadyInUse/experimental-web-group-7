const chalk = require(`chalk`);

module.exports = routes => {
  routes.forEach(route => {
    const method = chalk.yellow(route.method);
    const path = chalk.yellow(route.path);

    console.log(`\t${method} --> ${path}`);
  });
};
