const path = require('path');
const rollup = require('rollup');
const noderesolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');

const plugins = [
  noderesolve(),
  commonjs(),
  babel({
    exclude: 'node_modules/**',
    runtimeHelpers: true,
  }),
];

const writeSettings = {
  format: 'iife',
  sourcemap: true,
};

if (process.env.NODE_ENV === 'production') {
  plugins.push(uglify());
  writeSettings.sourcemap = false;
}

const createBundle = (file, dest) =>
  new Promise(async (resolve, reject) => {
    const bundle = await rollup
      .rollup({
        input: file,
        plugins,
      })
      .catch(reject);

    const output = path.basename(file);

    await bundle
      .write({
        file: path.join(dest, `${output}`),
        ...writeSettings,
      })
      .catch(reject);

    resolve();
  });

module.exports = config =>
  new Promise(async (resolve, reject) => {
    const bundlePromises = config.src.map(file => createBundle(file, config.dest));
    await Promise.all(bundlePromises).catch(reject);
    resolve();
  });
