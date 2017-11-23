const gulp = require(`gulp`);
const gutil = require(`gulp-util`);
const sequence = require(`run-sequence`);
const Path = require(`path`);
const chalk = require(`chalk`);

const css = require(`./tasks/css`);
const js = require(`./tasks/js`);
const rev = require(`./tasks/rev`);
const html = require(`./tasks/html`);
const clean = require(`./tasks/clean`);

const _ = strings => Path.join(__dirname, strings[0]);
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
  }
};

gulp.task(`css`, async () => {
  await css(config.css).catch(gooi);
});

gulp.task(`js`, async () => {
  await js(config.js).catch(gooi);
});

gulp.task(`rev`, async () => {
  await rev(config.css.rev, __dirname).catch(gooi);
  await rev(config.js.rev, __dirname).catch(gooi);
});

gulp.task(`html`, async () => {
  await html(config.html, __dirname).catch(gooi);
});

gulp.task(`clean`, async () => {
  await clean(config.clean).catch(gooi);
});

gulp.task(`production`, () => sequence(`clean`, `css`, `js`, `rev`, `html`));

gulp.task(`development`, () => {
  sequence(`clean`, `css`, `js`, `html`);

  gulp.watch(`./src/css/**/*.css`, [`css`]);
  gulp.watch(`./src/js/**/*.js`, [`js`]);
  gulp.watch(`./src/**/*.pug`, [`html`]);
});

gulp.task(`default`, [`development`]);
