const path = require('path');
const nodeExternals = require('webpack-node-externals');

const cwd = process.cwd();

export const outputPath = path.join(cwd, '.webpack');
export const outputFilename = 'bundle.js';

const getAlias = () => ({});

// eslint-disable-next-line
const esm = [
  'node-fetch3',
  'data-uri-to-buffer',
  'fetch-blob',
  'formdata-polyfill',
];

const allowlist = [/@gymang/];

const getExternals = () => ({
  externals: [
    nodeExternals({
      allowlist,
    }),
    nodeExternals({
      modulesDir: path.resolve(__dirname, '../node_modules'),
      allowlist,
    }),
  ],
});

export default {
  context: cwd,
  mode: 'development',
  devtool: false,
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.mjs'],
    ...getAlias(),
  },
  output: {
    libraryTarget: 'commonjs2',
    path: outputPath,
    filename: outputFilename,
  },
  target: 'node',
  ...getExternals(),
  module: {
    rules: [
      {
        test: /\.mjs$/,
        type: 'javascript/auto',
      },
      {
        test: /\.(js|jsx|ts|tsx)?$/,
        use: {
          loader: 'babel-loader?cacheDirectory',
        },
        exclude: [
          /node_modules/,
          path.resolve(__dirname, '.serverless'),
          path.resolve(__dirname, '.webpack'),
        ],
      },
      {
        test: /\.(pem|p12)?$/,
        type: 'asset/source',
      },
    ],
  },
  plugins: [],
  node: {
    __dirname: true,
    __filename: true,
  },
};
