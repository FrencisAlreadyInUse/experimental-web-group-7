const gulp = require('gulp');
const postcss = require('gulp-postcss');
const gulpif = require('gulp-if');
const clean = require('gulp-clean-css');

const production = process.env.NODE_ENV === 'production';

module.exports = config =>
  new Promise((resolve, reject) => {
    gulp
      .src(config.src)

      .pipe(postcss())
      .pipe(gulpif(production, clean()))

      .pipe(gulp.dest(config.dest))

      .on('error', reject)
      .on('end', resolve);
  });
