const { promisify } = require('util');
const rimraf = promisify(require('rimraf')); // eslint-disable-line
const mkdirp = promisify(require('mkdirp')); // eslint-disable-line

module.exports = config =>
  new Promise(async (resolve, reject) => {
    const removePromises = config.remove.map(item => rimraf(item));
    await Promise.all(removePromises).catch(reject);

    const createPromises = config.create.map(item => mkdirp(item));
    await Promise.all(createPromises).catch(reject);

    resolve();
  });
