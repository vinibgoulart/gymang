const config = require('./configCommon');
// const pluginsProduction = require('./pluginsProduction');

module.exports = (api) => {
  api.cache.using(() => process.env.NODE_ENV);

  // const enableFastRefresh = !api.env('production') && !api.env('test');

  // const plugins = pluginsProduction(api.env('production'));

  return {
    presets: [
      ...config.presets,
      [
        '@babel/preset-env',
        {
          corejs: 3,
          modules: false,
          useBuiltIns: 'usage',
        },
      ],
    ],
    plugins: [
      ...config.plugins,
      // ...plugins,
      // Applies the react-refresh Babel plugin on non-production modes only
      // ...(enableFastRefresh ? ['react-refresh/babel'] : []),
    ],
  };
};
