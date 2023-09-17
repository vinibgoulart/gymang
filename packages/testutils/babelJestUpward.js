const transformer = require('babel-jest');

module.exports = transformer.default.createTransformer({
    rootMode: 'upward',
});
