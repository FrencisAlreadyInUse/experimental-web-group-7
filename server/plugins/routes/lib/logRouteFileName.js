const Path = require(`path`);
const chalk = require(`chalk`);

module.exports = file => {
  const pluginName = chalk.cyan(`[ ROUTE ]`);
  const fileName = chalk.yellow(Path.basename(file));

  console.log(`\t${pluginName} registered ${fileName}`); /* prettier-ignore */
};
