// eslint-disable-next-line
const pkg = require('./package.json');
// eslint-disable-next-line
const jestBaseConfig = require('../../packages/testutils/jest.web.config.base');

module.exports = {
  ...jestBaseConfig,
  name: pkg.name,
  displayName: pkg.name,
  moduleNameMapper: {
    // When changing these, also look at the tsconfig!
    '^types/(.+)$': '<rootDir>/types/$1',
  },
  verbose: true,
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.(js|ts|tsx)?$': [
      'babel-jest',
      { configFile: './apps/web/test/.babelrc' },
    ],
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
