const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const WebpackNodeExternals = require('webpack-node-externals');

const webpackCommonConfig = require('./webpackCommonConfig');

module.exports = merge(webpackCommonConfig, {
  mode: 'development',
  devtool: 'eval-cheap-source-map',
  externals: [
    WebpackNodeExternals({
      allowlist: ['webpack/hot/poll?1000'],
    }),
    WebpackNodeExternals({
      modulesDir: path.resolve(__dirname, '../../../node_modules'),
      allowlist: [/@gymang/],
    }),
  ],
  // below is closer to production
  // externals: [
  //   'utf-8-validate',
  //   'bufferutil',
  //   'pino-pretty',
  //   'mongodb-client-encryption',
  //   'snappy',
  //   'kerberos',
  //   'bson-ext',
  //   'snappy/package.json',
  //   '@mongodb-js/zstd',
  //   'jsdom',
  //   'formidable',
  // ],
  plugins: [
    // it should be customize per final config
    // new ReloadServerPlugin({
    //   script: path.resolve('build', 'graphql.js'),
    // }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
  // uncomment to have less warnings
  stats: { warnings: false },
  cache: {
    type: 'filesystem',
    allowCollectingMemory: true,
  },
});
