const chalk = require('chalk');
const log = require('fancy-log');

module.exports = function emit(key, ...value) {
  const cKey = chalk.yellow(key);

  if (this.enableLogging) log(`${this.label} ↑ emitted "${cKey}"`);

  this.socket.emit(key, ...value);
};
