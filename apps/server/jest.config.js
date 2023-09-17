const jestBaseConfig = require("../../packages/testutils/jest.config.base");

const pkg = require("./package.json");

module.exports = {
  ...jestBaseConfig,
  name: pkg.name,
  displayName: pkg.name,
};
