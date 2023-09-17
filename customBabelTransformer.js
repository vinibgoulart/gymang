const babelJest = require('babel-jest');

const { configJest } = require('@gymang/babel');

module.exports = babelJest.createTransformer(configJest);
