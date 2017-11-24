const gulp = require(`gulp`);
const rev = require(`gulp-rev`);

module.exports = (config, root) =>
  new Promise(async (resolve, reject) => {
    gulp
      .src(config.glob)

      .pipe(rev())
      .pipe(gulp.dest(config.dest))

      .pipe(rev.manifest({merge: true}))
      .pipe(gulp.dest(root))

      .on(`error`, reject)
      .on(`end`, resolve);
  });
