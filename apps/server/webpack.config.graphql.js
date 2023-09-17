const path = require('path');
const { merge } = require('webpack-merge');

const ReloadServerPlugin = require('./webpack/ReloadServerPlugin');
const webpackDevConfig = require('./webpack/webpackDevConfig');

const filename = 'index.js';

module.exports = merge(webpackDevConfig, {
  entry: {
    server: ['./src/index.ts'],
  },
  output: {
    filename,
  },
  plugins: [
    new ReloadServerPlugin({
      script: path.resolve('dist', filename),
      execArgv: ['--trace-warnings'], // trace warnings in code
    }),
  ],
});
