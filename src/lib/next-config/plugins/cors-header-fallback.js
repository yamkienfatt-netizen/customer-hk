const config = require('../../../temp/config');

/**
 * @param {import('next').NextConfig} nextConfig
 */
const corsHeaderFallbackPlugin = (nextConfig = {}) => {
  if (config.sitecoreApiHost || process.env.NEXT_PUBLIC_ROLE_CONTENT_DELIVERY === 'true') {
    return nextConfig;
  }
  return Object.assign({}, nextConfig, {
    async headers() {
      const extendHeaders =
        typeof nextConfig.headers === 'function' ? await nextConfig.headers() : [];
      return [
        ...(await extendHeaders),
        {
          source: '/_next/:path*',
          headers: [
            {
              key: 'Access-Control-Allow-Origin',
              value: '*',
            },
          ],
        },
      ];
    },
  });
};

module.exports = corsHeaderFallbackPlugin;
