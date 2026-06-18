/**
 * @param {import('next').NextConfig} nextConfig
 */
const resolveFsPlugin = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack: (config, options) => {
      if (!options.isServer) {
        config.resolve.fallback = Object.assign({}, config.resolve.fallback || {}, {
          fs: false,
        });
      }
      // Overload the Webpack config if it was already overloaded
      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
};

module.exports = resolveFsPlugin;
