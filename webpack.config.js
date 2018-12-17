const fs = require('fs');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    './dist/plugin-emoji.min': './plugin.js',
    './dist/plugin-emoji-prelim.min': './prelim.js'
  },
  output: {
    path: __dirname,
    filename: '[name].js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['@babel/preset-env'],
      }
    }]
  },
  devtool: 'source-map',
  devServer: {
      contentBase: path.join(__dirname, "dist"),
      compress: true,
      host: "0.0.0.0"
  },
  plugins: [
    new UglifyJsPlugin()
  ]
};
