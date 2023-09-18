// eslint-disable-next-line
const relay = require('./relay.config.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@gymang/ui', '@gymang/form'],
  compiler: {
    relay: {
      src: relay.src,
      artifactDirectory: relay.artifactDirectory,
      language: relay.language,
    },
    externalDir: true,
    experimental: {
      runtime: 'nodejs',
      concurrentFeatures: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    serverRuntimeConfig: {
      projectRoot: __dirname,
    },
  },
};

module.exports = nextConfig;
