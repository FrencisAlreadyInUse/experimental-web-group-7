const chalk = require('chalk');
const log = require('fancy-log');

module.exports = function on(key, handler) {
  const cKey = chalk.yellow(key);
  const cId = chalk.yellow(this.socket.id);

  this.socket.on(key, (...value) => {
    if (this.enableLogging) log(`${this.label} ↓ received "${cKey}" from "${cId}"`);

    handler(...value);
  });
};
