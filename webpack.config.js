const path = require('path');

module.exports = {
  entry: {
    index: './src/js/index.js',
    game: './src/js/game.js',
    style: './src/css/index.css',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'server/public'),
  },
};
