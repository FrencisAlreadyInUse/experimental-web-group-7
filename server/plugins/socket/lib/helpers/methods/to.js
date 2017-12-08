const chalk = require('chalk');
const log = require('fancy-log');

module.exports = function to(id, key, ...value) {
  const cId = chalk.yellow(id);
  const ckey = chalk.yellow(key);

  if (this.enableLogging) log(`${this.label} ↑ emitted "${ckey}" to "${cId}"`);

  this.socket.to(id).emit(key, ...value);
};
