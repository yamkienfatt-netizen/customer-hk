const config = require('../../../temp/config');
const noCacheRoutes = (process.env.NO_CACHE_ROUTES ?? '').split(',');
const noCacheHeaders = noCacheRoutes.map((v) => ({
  source: v,
  headers: [
    {
      key: 'Cache-Control',
      value: `no-cache`,
    },
  ],
}));

/**
 * @param {import('next').NextConfig} nextConfig
 */
const cacheHeaderPlugin = (nextConfig = {}) => {
  if (!noCacheHeaders.length) {
    return nextConfig;
  }
  return Object.assign({}, nextConfig, {
    async headers() {
      const extendHeaders =
        typeof nextConfig.headers === 'function' ? await nextConfig.headers() : [];
      return [
        ...(await extendHeaders),
        ...noCacheHeaders,
      ];
    },
  });
};

module.exports = cacheHeaderPlugin;
