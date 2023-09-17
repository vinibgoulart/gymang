const path = require('path');

// const CircularDependencyPlugin = require('circular-dependency-plugin');

const cwd = process.cwd();

const include = [path.join(cwd, 'src'), path.join(cwd, '../'), /@gymang/];

module.exports = {
  context: cwd,
  // it should be customize per final config
  // entry: {
  //   server: [
  //     './src/graphql/index.ts',
  //   ],
  // },
  output: {
    path: path.resolve('build'),
    // library: 'index',
    libraryTarget: 'commonjs2',
    // it should be customize per final config
    // filename: 'graphql.js',
  },
  target: 'node',
  node: {
    __dirname: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.mjs'],
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.(js|jsx|ts|tsx)?$/,
        use: {
          loader: 'babel-loader?cacheDirectory',
        },
        exclude: [/node_modules/],
        include,
      },
      {
        test: /\.(pem|p12)?$/,
        type: 'asset/source',
      },
    ],
  },
  // TODO - enable filesystem cache
  // cache: {
  //   type: 'filesystem',
  //   buildDependencies: {
  //     config: [__filename],
  //   },
  // },
  plugins: [
    // it should be customize per final config
    // new ReloadServerPlugin({
    //   script: path.resolve('build', 'graphql.js'),
    // }),
    // new CircularDependencyPlugin({
    //   // exclude detection of files based on a RegExp
    //   exclude: /node_modules/,
    //   // add errors to webpack instead of warnings
    //   failOnError: false,
    //   allowAsyncCycles: false,
    //   cwd,
    //   // include specific path to help debug circular dependencies
    //   // include: /modules\/performanceReview\/userPerformanceReview\/UserPerformanceReviewLoader/,
    // }),
  ],
};
