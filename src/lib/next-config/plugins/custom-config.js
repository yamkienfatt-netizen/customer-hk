/**
 * @param {import('next').NextConfig} nextConfig
 */
const customConfigPlugin = (nextConfig = {}) => {
  const isContentDelivery = process.env.NEXT_PUBLIC_ROLE_CONTENT_DELIVERY === 'true';
  return Object.assign({}, nextConfig, {
    i18n: {
      ...nextConfig.i18n,
      locales: [
        ...(isContentDelivery ? ['default'] : []),
        'en',
        'sc',
        'tc',
        'es',
        'pt',
        'zh-CN',
        'zh-HK',
      ],
      defaultLocale: isContentDelivery ? 'default' : 'en',
    },
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
    },
    trailingSlash: isContentDelivery,
  });
};

module.exports = customConfigPlugin;
