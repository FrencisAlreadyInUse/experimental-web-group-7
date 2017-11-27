const chalk = require('chalk');
const log = require('fancy-log');

module.exports = function air(key, ...value) {
  const sendingSocket = chalk.yellow(this.socket.id);
  const cKey = chalk.yellow(key);

  log(`${this.label} "${sendingSocket}" ↑ broadcasted "${cKey}"`);

  this.socket.broadcast.emit(key, ...value);
};
