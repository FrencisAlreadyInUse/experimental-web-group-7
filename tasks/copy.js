const { promisify } = require('util');
const copy = promisify(require('ncp')); // eslint-disable-line

module.exports = config =>
  new Promise(async (resolve, reject) => {
    const copyPromises = config.map(conf => copy(conf.from, conf.to));
    await Promise.all(copyPromises).catch(reject);
    resolve();
  });
