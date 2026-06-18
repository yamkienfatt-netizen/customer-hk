/**
 * @param {import('next').NextConfig} nextConfig
 */
const securityHeadersPlugin = (nextConfig = {}) => {
  if (!(process.env.JSS_SECURITY_HEADER === 'true')) {
    return nextConfig;
  }
  return Object.assign({}, nextConfig, {
    poweredByHeader: false,
    async headers() {
      const extendHeaders =
        typeof nextConfig.headers === 'function' ? await nextConfig.headers() : [];
      return [
        ...(await extendHeaders),
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'X-Frame-Options',
              value: 'SAMEORIGIN'
            }
          ],
        },
      ];
    },
  });
};

module.exports = securityHeadersPlugin;
