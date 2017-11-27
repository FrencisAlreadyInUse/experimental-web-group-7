const { promisify } = require('util');
const copy = promisify(require('ncp')); // eslint-disable-line

module.exports = config =>
  new Promise(async (resolve, reject) => {
    await copy(config.src, config.dest).catch(reject);
    resolve();
  });
