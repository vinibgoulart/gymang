module.exports = {
  presets: [
    // [
    //   '@babel/preset-react',
    //   {
    //     runtime: 'automatic',
    //   },
    // ],
    // '@babel/preset-typescript',
  ],
  plugins: [
    [
      'relay',
      {
        schema: './schemas/server/schema.graphql',
      },
    ],
    // '@babel/plugin-proposal-class-properties',
  ],
  // env: {
  //   test: {
  //     presets: [
  //       [
  //         '@babel/preset-env',
  //         {
  //           corejs: 3,
  //           useBuiltIns: 'usage',
  //         },
  //       ],
  //       [
  //         '@babel/preset-react',
  //         {
  //           runtime: 'automatic',
  //         },
  //       ],
  //       '@babel/preset-typescript',
  //     ],
  //     plugins: [
  //       ['@babel/plugin-proposal-class-properties', { loose: true }],
  //       ['@babel/plugin-proposal-private-methods', { loose: true }],
  //       ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
  //     ],
  //   },
  // },
};
