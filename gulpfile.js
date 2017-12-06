const gulp = require('gulp');
const cache = require('gulp-cached');

gulp.task('copy', async () => {
  gulp
    .src('src/**/*')
    .pipe(cache('copy-caches'))
    .pipe(gulp.dest('server/public'));
});

gulp.task('production', ['copy']);

gulp.task('development', ['copy'], () => {
  gulp.watch('src/**/*', ['copy']);
});
