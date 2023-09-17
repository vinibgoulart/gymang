const { workspaces = [] } = require("./package.json");

module.exports = {
  babelrcRoots: [".", ...(workspaces.packages || workspaces)],
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current",
        },
      },
    ],
    [
      "@babel/preset-react",
      {
        runtime: "automatic",
      },
    ],
    "@babel/preset-typescript",
  ],
  plugins: [
    "@babel/plugin-proposal-export-default-from",
    "@babel/plugin-proposal-export-namespace-from",
    "@babel/plugin-proposal-nullish-coalescing-operator",
    "@babel/plugin-proposal-optional-chaining",
    ["@babel/plugin-proposal-class-properties", { loose: true }],
    ["@babel/plugin-proposal-private-methods", { loose: true }],
    ["@babel/plugin-proposal-private-property-in-object", { loose: true }],
  ],
  env: {
    test: {
      plugins: ["require-context-hook"],
    },
  },
};
