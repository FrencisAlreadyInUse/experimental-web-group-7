const gulp = require(`gulp`);
const gutil = require(`gulp-util`);
const sequence = require(`run-sequence`);
const path = require(`path`);
const chalk = require(`chalk`);

const task = require(`./tasks`);

const _ = strings => path.join(__dirname, strings[0]);
const gooi = error => gutil.log(chalk.red(`[ERROR]`), error);

const config = {
  js: {
    src: [_`src/js/script.js`],
    dest: _`server/public/js`,
    rev: {
      glob: _`server/public/js/*.js`,
      dest: _`server/public/js`
    }
  },
  css: {
    src: [_`src/css/style.css`],
    dest: _`server/public/css`,
    rev: {
      glob: _`server/public/css/*.css`,
      dest: _`server/public/css`
    }
  },
  html: {
    src: [_`src/*.pug`],
    dest: _`server/public`
  },
  clean: {
    remove: [_`server/public`, _`rev-manifest.json`],
    create: [_`server/public`]
  },
  copy: {
    src: _`src/assets`,
    dest: _`server/public/assets`
  }
};

gulp.task(`css`, async () => {
  await task.css(config.css).catch(gooi);
});

gulp.task(`js`, async () => {
  await task.js(config.js).catch(gooi);
});

gulp.task(`rev`, async () => {
  await task.rev(config.css.rev, __dirname).catch(gooi);
  await task.rev(config.js.rev, __dirname).catch(gooi);
});

gulp.task(`html`, async () => {
  await task.html(config.html, __dirname).catch(gooi);
});

gulp.task(`clean`, async () => {
  await task.clean(config.clean).catch(gooi);
});

gulp.task(`copy`, async () => {
  await task.copy(config.copy).catch(gooi);
});

gulp.task(`production`, () => sequence(`clean`, `copy`, `css`, `js`, `rev`, `html`));

gulp.task(`development`, () => {
  sequence(`clean`, `copy`, `css`, `js`, `html`);

  gulp.watch(`./src/css/**/*.css`, [`css`]);
  gulp.watch(`./src/js/**/*.js`, [`js`]);
  gulp.watch(`./src/**/*.pug`, [`html`]);
});
