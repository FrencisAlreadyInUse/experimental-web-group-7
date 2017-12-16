const path = require('path');
const { promisify } = require('util');

const webpack = require('webpack');
const { getIfUtils, removeEmpty } = require('webpack-config-utils');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

const rmrf = promisify(require('rimraf'));
const cp = require('recursive-copy');
const mkdirp = require('make-dir');

const { UglifyJsPlugin } = webpack.optimize;
const { HotModuleReplacementPlugin } = webpack;
const { ifProduction, ifDevelopment } = getIfUtils(process.env.NODE_ENV);

const extractCss = new ExtractTextWebpackPlugin('css/style.css');

/**
 * Returns a path joined to the current __dirname
 * (Use as tagged template literal)
 */
const _ = strings => path.join(__dirname, strings[0]);

/**
 * Remove the contents of the server/public directory
 */
const cleanPublicDirectory = async () => {
  await rmrf(_`server/public`);
  await mkdirp(_`server/public`);
};

/**
 * Copy needed directories to server/public
 */
const copyToPublicDirectory = async () => {
  await cp(_`src/assets`, _`server/public/assets`).catch(console.error);
  // await cp(_`src/js/vendor`, _`server/public/js/vendor`).catch(console.error);
};

/**
 * Generate the webpack config file to export later
 */
const generateWebpackConfig = async () => {
  //
  await cleanPublicDirectory();
  await copyToPublicDirectory();

  const config = {
    entry: {
      bundle: [_`src/js/index.js`, _`src/css/index.css`],
      vendors: [_`src/js/vendors.js`],
    },
    output: {
      filename: 'js/[name].js',
      path: _`server/public`,
      publicPath: '/',
    },
    devtool: 'sourcemap',
    module: {
      rules: removeEmpty([
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: [{ loader: 'babel-loader' }],
        },
        {
          test: /\.(svg|png|jpe?g|gif|webp)$/,
          loader: 'url-loader',
          options: {
            limit: 1000,
            context: './src',
            name: '[path][name].[ext]',
          },
        },
        {
          test: /\.(mp3|mp4|wav)$/,
          loader: 'file-loader',
          options: {
            context: './src',
            name: '[path][name].[ext]',
          },
        },
        ifDevelopment({
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        }),
        ifProduction({
          test: /\.css$/,
          use: extractCss.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'postcss-loader'],
          }),
        }),
      ]),
    },
    plugins: removeEmpty([
      new HtmlWebpackPlugin({
        template: _`src/index.html`,
        filename: _`server/public/index.html`,
        inject: false,
      }),
      new webpack.EnvironmentPlugin(['NODE_ENV']),
      ifProduction(new UglifyJsPlugin({ sourceMap: true, comments: false })),
      ifProduction(new HotModuleReplacementPlugin()),
      ifProduction(extractCss),
    ]),
  };

  return config;
};

module.exports = generateWebpackConfig();
