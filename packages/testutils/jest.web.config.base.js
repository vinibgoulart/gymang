const jestTransformer = () => {
  if (
    !process.env?.JEST_TRANSFORMER ||
    process.env.JEST_TRANSFORMER === 'babel-jest'
  ) {
    console.log('customBabelTransformer path', require('path').resolve('./customBabelTransformer'));
    return {
      '^.+\\.(js|ts|tsx)?$': require('path').resolve(
        './customBabelTransformer',
      ),
    };
  }

  if (process.env.JEST_TRANSFORMER === 'esbuild-jest') {
    return {
      '^.+\\.(js|ts|tsx)?$': 'esbuild-jest',
    };
  }

  if (process.env.JEST_TRANSFORMER === 'swc-jest') {
    return {
      '^.+\\.(js|ts|tsx)?$': [
        '@swc/jest',
        {
          sourceMaps: true,

          jsc: {
            parser: {
              syntax: 'typescript',
              tsx: true,
            },
          },
        },
      ],
    };
  }
};

module.exports = {
  testPathIgnorePatterns: [
    '/node_modules/',
    './dist',
    './scripts',
    '__generated__',
  ],
  transformIgnorePatterns: ['node_modules/(?!d3-random)'],
  testEnvironment: 'jsdom',
  transform: {
    ...jestTransformer(),
    // '^.+\\.(md|mdx)$': 'jest-transformer-mdx',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(j|t)s?sx?$',
  moduleFileExtensions: ['js', 'css', 'ts', 'tsx', 'json'],
  moduleDirectories: ['node_modules', 'src'],
  cacheDirectory: '.jest-cache',
  rootDir: './',
  cacheDirectory: '.jest-cache',
  // setupFiles: ['<rootDir>/../testutils/test/setupFilesWeb.js'],
};
