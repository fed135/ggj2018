const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const JavaScriptObfuscator = require('webpack-obfuscator');

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
    new CopyWebpackPlugin([
      {
        from: './client/assets',
        to: './dist/assets'
      }
    ]),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        return module.resource && vendorPackages.test(module.resource) && count >= 1;
      }
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        mangle: true,
        drop_console: true,
        minimize: true
      },
      output: {
        comments: false,
        beautify: false
      }
    }),
    new JavaScriptObfuscator({
      rotateUnicodeArray: true
    }, [ 'vendor.bundle.js' ]),
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
