module.exports = [
  {
    method: `GET`,
    path: `/{param*}`,
    handler: {
      directory: {
        path: `.`,
        redirectToSlash: true,
        index: true
      }
    }
  },
  {
    method: `GET`,
    path: `/rtc/{param*}`,
    handler: {
      file: `rtc.html`
    }
  },
  {
    method: `GET`,
    path: `/uploads/{param*}`,
    handler: {
      directory: {
        path: `../uploads`
      }
    }
  }
];
