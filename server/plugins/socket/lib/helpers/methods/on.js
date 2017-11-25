const chalk = require('chalk');
const log = require('fancy-log');

module.exports = function on(key, handler) {
  const cKey = chalk.yellow(key);

  this.socket.on(key, (value) => {
    log(`${this.label} ↓ received "${cKey}"`);

    handler(value);
  });
};
