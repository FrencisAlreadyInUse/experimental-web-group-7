const gulp = require('gulp');
const pug = require('gulp-pug');
const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');

module.exports = (config, root) =>
  new Promise(async (resolve, reject) => {
    const manifest = path.join(root, 'rev-manifest.json');
    const locals = {};

    let revdata;
    revdata = await fs.readJson(manifest).catch(() => (revdata = {})); // eslint-disable-line
    revdata = _.mapKeys(revdata, (value, key) => key.toUpperCase().replace(/(\.|-)/, '_'));

    gulp
      .src(config.src)

      .pipe(pug({ locals: { ...locals, ...revdata } }))

      .pipe(gulp.dest(config.dest))

      .on('error', reject)
      .on('end', resolve);
  });
