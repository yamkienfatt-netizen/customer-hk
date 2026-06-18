/**
 * @param {import('next').NextConfig} nextConfig
 */
const hstsHeaderPlugin = (nextConfig = {}) => {
  if (process.env.ENABLE_HSTS_HEADER !== 'true') {
    return nextConfig;
  }
  return Object.assign({}, nextConfig, {
    async headers() {
      const extendHeaders =
        typeof nextConfig.headers === 'function' ? await nextConfig.headers() : [];
      return [
        ...(await extendHeaders),
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=63072000; includeSubDomains; preload',
            },
          ],
        },
      ];
    },
  });
};

module.exports = hstsHeaderPlugin;
