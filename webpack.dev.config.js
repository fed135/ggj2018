const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const howler = path.join(__dirname, '/node_modules/howler/dist/howler.min.js');
const vendorPackages = /howler|pixi.js/;

module.exports = {
  entry: {
    vendor: [ 'pixi.js', 'howler' ],
    app: [
      path.resolve(__dirname, 'client/app.ts')
    ]
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve('./dist'),
    publicPath: '/'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        return module.resource && vendorPackages.test(module.resource) && count >= 1;
      }
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: 'body'
    })
  ],
  module: {
    loaders: [
      { test: /\.ts?$/, loader: 'ts-loader', exclude: '/node_modules/' },
      { test: /pixi\.js/, use: [ 'expose-loader?PIXI' ] },
      { test: /howler\.min\.js/, use: [ 'expose-loader?Howler' ] },
      { test: /\.png$/, use: 'url-loader?mimetype=image/png' },
    ]
  },
  resolve: {
    extensions: [ '.js', '.ts' ],
    alias: {
      'howler': howler
    }
  }
};
