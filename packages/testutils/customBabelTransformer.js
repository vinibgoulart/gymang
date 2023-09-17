const babelJest = require('babel-jest');

const { configWeb } = require('@gymang/babel');

module.exports = babelJest.createTransformer(configWeb);
