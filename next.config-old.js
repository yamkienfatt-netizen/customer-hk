const jssConfig = require('./src/temp/config');
const { getPublicUrl } = require('@sitecore-jss/sitecore-jss-nextjs/utils');
const plugins = require('./src/temp/next-config-plugins') || {};

const publicUrl = jssConfig.publicUrl;

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Set assetPrefix to our public URL
  assetPrefix: publicUrl,

  // Allow specifying a distinct distDir when concurrently running app in a container
  distDir: process.env.NEXTJS_DIST_DIR || '.next',

  // Make the same PUBLIC_URL available as an environment variable on the client bundle
  env: {
    PUBLIC_URL: publicUrl,
    XMCLOUD_MEDIA_LIBRARY_HOST: process.env.XMCLOUD_MEDIA_LIBRARY_HOST,
    CAPTCHA_SCENE_ID: process.env.CAPTCHA_SCENE_ID,
    CAPTCHA_PREFIX_ID: process.env.CAPTCHA_PREFIX_ID,
  },

  i18n: {
    // These are all the locales you want to support in your application.
    // These should generally match (or at least be a subset of) those in Sitecore.
    locales: ['en', 'sc', 'tc', 'es', 'pt', 'zh-CN', 'zh-HK'],
    // This is the locale that will be used when visiting a non-locale
    // prefixed path e.g. `/styleguide`.
    defaultLocale: 'en',
  },

  // Enable React Strict Mode
  reactStrictMode: true,

  // Disable the X-Powered-By header. Follows security best practices.
  poweredByHeader: false,

  // swcMinify: true,

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }

    return config;
  },

  async rewrites() {
    // When in connected mode we want to proxy Sitecore paths off to Sitecore
    return [
      // API endpoints
      {
        source: '/sitecore/api/:path*',
        destination: `${jssConfig.sitecoreApiHost}/sitecore/api/:path*`,
      },
      // media items
      {
        source: '/-/:path*',
        destination: `${jssConfig.sitecoreApiHost}/-/:path*`,
      },
      // healthz check
      {
        source: '/healthz',
        destination: '/api/healthz',
      },
      // rewrite for Sitecore service pages
      {
        source: '/sitecore/service/:path*',
        destination: `${jssConfig.sitecoreApiHost}/sitecore/service/:path*`,
      },
    ];
  },

  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },

  async redirects() {
    return [
      {
        source: '/en/ideas-to-wake-up-to/',
        destination: '/en/whats-on/',
        permanent: true,
      },
      {
        source: '/en/ideas-to-wake-up-to/our-ideas/',
        destination: '/en/whats-on/past-events/',
        permanent: true,
      },
      {
        source: '/en/where-it-all-starts/',
        destination: '/en/',
        permanent: true,
      },
      {
        source: '/es/',
        destination: '/en/',
        permanent: true,
      },
      {
        source: '/es/cookies-policy/',
        destination: '/en/cookies-policy/',
        permanent: true,
      },
      {
        source: '/es/ideas-to-wake-up-to/',
        destination: '/en/whats-on/',
        permanent: true,
      },
      {
        source: '/es/ideas-to-wake-up-to/our-ideas/',
        destination: '/en/whats-on/past-events/',
        permanent: true,
      },
      {
        source: '/es/keep-in-touch/',
        destination: '/en/keep-in-touch/',
        permanent: true,
      },
      {
        source: '/es/privacy-policy/',
        destination: '/en/privacy-policy/',
        permanent: true,
      },
      {
        source: '/es/special-offers/',
        destination: '/en/special-offers/',
        permanent: true,
      },
      {
        source: '/es/where-it-all-starts/',
        destination: '/en/',
        permanent: true,
      },
      {
        source: '/pt/',
        destination: '/en/',
        permanent: true,
      },
      {
        source: '/pt/cookies-policy/',
        destination: '/en/privacy-policy/',
        permanent: true,
      },
      {
        source: '/pt/ideas-to-wake-up-to/',
        destination: '/en/whats-on/',
        permanent: true,
      },
      {
        source: '/pt/ideas-to-wake-up-to/our-ideas/',
        destination: '/en/whats-on/past-events/',
        permanent: true,
      },
      {
        source: '/pt/keep-in-touch/',
        destination: '/en/keep-in-touch/',
        permanent: true,
      },
      {
        source: '/pt/privacy-policy/',
        destination: '/en/privacy-policy/',
        permanent: true,
      },
      {
        source: '/pt/special-offers/',
        destination: '/en/special-offers/',
        permanent: true,
      },
      {
        source: '/pt/where-it-all-starts/',
        destination: '/en/',
        permanent: true,
      },
      {
        source: '/sc/ideas-to-wake-up-to/',
        destination: '/sc/whats-on/',
        permanent: true,
      },
      {
        source: '/sc/ideas-to-wake-up-to/our-ideas/',
        destination: '/sc/whats-on/past-events/',
        permanent: true,
      },
      {
        source: '/sc/where-it-all-starts/',
        destination: '/sc/',
        permanent: true,
      },
      {
        source: '/tc/ideas-to-wake-up-to/',
        destination: '/tc/whats-on/',
        permanent: true,
      },
      {
        source: '/tc/ideas-to-wake-up-to/our-ideas/',
        destination: '/tc/whats-on/past-events/',
        permanent: true,
      },
      {
        source: '/tc/where-it-all-starts/',
        destination: '/tc/',
        permanent: true,
      },
      {
        source: '/en/beijing/about/',
        destination: '/en/beijing/at-east/',
        permanent: true,
      },
      {
        source: '/en/beijing/about/art-and-design/',
        destination: '/en/beijing/at-east/',
        permanent: true,
      },
      {
        source: '/en/beijing/about/going-green/',
        destination: '/en/beijing/at-east/sustainability/',
        permanent: true,
      },
      {
        source: '/en/beijing/about/our-neighbourhood/',
        destination: '/en/beijing/at-east/our-neighbourhood/',
        permanent: true,
      },
      {
        source: '/en/beijing/beast/',
        destination: '/en/beijing/at-east/wellness-and-fitness/',
        permanent: true,
      },
      {
        source: '/en/beijing/contact-us/',
        destination: '/en/beijing/find-us/',
        permanent: true,
      },
      {
        source: '/en/beijing/gallery/',
        destination: '/en/beijing/at-east/gallery/',
        permanent: true,
      },
      {
        source: '/en/beijing/special-offers/suite-spot-202210/',
        destination: '/en/beijing/special-offers/suite-indeed/',
        permanent: true,
      },
      {
        source: '/sc/beijing/about/',
        destination: '/sc/beijing/at-east/',
        permanent: true,
      },
      {
        source: '/sc/beijing/about/art-and-design/',
        destination: '/sc/beijing/at-east/',
        permanent: true,
      },
      {
        source: '/sc/beijing/about/going-green/',
        destination: '/sc/beijing/at-east/sustainability/',
        permanent: true,
      },
      {
        source: '/sc/beijing/about/our-neighbourhood/',
        destination: '/sc/beijing/at-east/our-neighbourhood/',
        permanent: true,
      },
      {
        source: '/sc/beijing/beast/',
        destination: '/sc/beijing/at-east/wellness-and-fitness/',
        permanent: true,
      },
      {
        source: '/sc/beijing/contact-us/',
        destination: '/sc/beijing/find-us/',
        permanent: true,
      },
      {
        source: '/sc/beijing/gallery/',
        destination: '/sc/beijing/at-east/gallery/',
        permanent: true,
      },
      {
        source: '/sc/beijing/special-offers/suite-spot-202210/',
        destination: '/sc/beijing/special-offers/suite-indeed/',
        permanent: true,
      },
      {
        source: '/tc/beijing/about/',
        destination: '/tc/beijing/at-east/',
        permanent: true,
      },
      {
        source: '/tc/beijing/about/art-and-design/',
        destination: '/tc/beijing/at-east/',
        permanent: true,
      },
      {
        source: '/tc/beijing/about/going-green/',
        destination: '/tc/beijing/at-east/sustainability/',
        permanent: true,
      },
      {
        source: '/tc/beijing/about/our-neighbourhood/',
        destination: '/tc/beijing/at-east/our-neighbourhood/',
        permanent: true,
      },
      {
        source: '/tc/beijing/beast/',
        destination: '/tc/beijing/at-east/wellness-and-fitness/',
        permanent: true,
      },
      {
        source: '/tc/beijing/contact-us/',
        destination: '/tc/beijing/find-us/',
        permanent: true,
      },
      {
        source: '/tc/beijing/gallery/',
        destination: '/tc/beijing/at-east/gallery/',
        permanent: true,
      },
      {
        source: '/tc/beijing/special-offers/suite-spot-202210/',
        destination: '/tc/beijing/special-offers/suite-indeed/',
        permanent: true,
      },
      {
        source: '/en/miami/about/',
        destination: '/en/miami/at-east/',
        permanent: true,
      },
      {
        source: '/en/miami/about/art-and-design/',
        destination: '/en/miami/at-east/',
        permanent: true,
      },
      {
        source: '/en/miami/about/going-green/',
        destination: '/en/miami/at-east/sustainability/',
        permanent: true,
      },
      {
        source: '/en/miami/about/our-neighborhood/',
        destination: '/en/miami/at-east/our-neighbourhood/',
        permanent: true,
      },
      {
        source: '/en/miami/beast/',
        destination: '/en/miami/at-east/wellness-and-fitness/',
        permanent: true,
      },
      {
        source: '/en/miami/contact-us/',
        destination: '/en/miami/find-us/',
        permanent: true,
      },
      {
        source: '/en/miami/gallery/',
        destination: '/en/miami/at-east/gallery/',
        permanent: true,
      },
      {
        source: '/en/miami/happenings/ideas-to-wake-up-to/',
        destination: '/en/miami/happenings/',
        permanent: true,
      },
      {
        source: '/en/miami/residences/2-bedroom-corner-residence/',
        destination: '/en/miami/residences/2-bedroom-residence/',
        permanent: true,
      },
      {
        source: '/en/miami/special-offers/asiannightbrunch/',
        destination: '/en/miami/special-offers/asian-night-brunch/',
        permanent: true,
      },
      {
        source: '/en/miami/weddings/',
        destination: '/en/miami/meetings-and-events/weddings-at-east/',
        permanent: true,
      },
      {
        source: '/es/miami/about/',
        destination: '/es/miami/at-east/',
        permanent: true,
      },
      {
        source: '/es/miami/about/art-and-design/',
        destination: '/es/miami/at-east/',
        permanent: true,
      },
      {
        source: '/es/miami/about/going-green/',
        destination: '/es/miami/at-east/sustainability/',
        permanent: true,
      },
      {
        source: '/es/miami/about/our-neighborhood/',
        destination: '/es/miami/at-east/our-neighbourhood/',
        permanent: true,
      },
      {
        source: '/es/miami/beast/',
        destination: '/es/miami/at-east/wellness-and-fitness/',
        permanent: true,
      },
      {
        source: '/es/miami/contact-us/',
        destination: '/es/miami/find-us/',
        permanent: true,
      },
      {
        source: '/es/miami/gallery/',
        destination: '/es/miami/at-east/gallery/',
        permanent: true,
      },
      {
        source: '/es/miami/happenings/ideas-to-wake-up-to/',
        destination: '/es/miami/happenings/',
        permanent: true,
      },
      {
        source: '/es/miami/residences/2-bedroom-corner-residence/',
        destination: '/es/miami/residences/2-bedroom-residence/',
        permanent: true,
      },
      {
        source: '/es/miami/special-offers/asiannightbrunch/',
        destination: '/es/miami/special-offers/asian-night-brunch/',
        permanent: true,
      },
      {
        source: '/es/miami/weddings/',
        destination: '/es/miami/meetings-and-events/weddings-at-east/',
        permanent: true,
      },
      {
        source: '/pt/miami/about/',
        destination: '/pt/miami/at-east/',
        permanent: true,
      },
      {
        source: '/pt/miami/about/art-and-design/',
        destination: '/pt/miami/at-east/',
        permanent: true,
      },
      {
        source: '/pt/miami/about/going-green/',
        destination: '/pt/miami/at-east/sustainability/',
        permanent: true,
      },
      {
        source: '/pt/miami/about/our-neighborhood/',
        destination: '/pt/miami/at-east/our-neighbourhood/',
        permanent: true,
      },
      {
        source: '/pt/miami/beast/',
        destination: '/pt/miami/at-east/wellness-and-fitness/',
        permanent: true,
      },
      {
        source: '/pt/miami/contact-us/',
        destination: '/pt/miami/find-us/',
        permanent: true,
      },
      {
        source: '/pt/miami/gallery/',
        destination: '/pt/miami/at-east/gallery/',
        permanent: true,
      },
      {
        source: '/pt/miami/happenings/ideas-to-wake-up-to/',
        destination: '/pt/miami/happenings/',
        permanent: true,
      },
      {
        source: '/pt/miami/residences/2-bedroom-corner-residence/',
        destination: '/pt/miami/residences/2-bedroom-residence/',
        permanent: true,
      },
      {
        source: '/pt/miami/special-offers/asiannightbrunch/',
        destination: '/pt/miami/special-offers/asian-night-brunch/',
        permanent: true,
      },
      {
        source: '/pt/miami/weddings/',
        destination: '/pt/miami/meetings-and-events/weddings-at-east/',
        permanent: true,
      },
      {
        source: '/en/hongkong/about/',
        destination: '/en/hongkong/at-east/',
        permanent: true,
      },
      {
        source: '/en/hongkong/about/art-and-design/',
        destination: '/en/hongkong/at-east/',
        permanent: true,
      },
      {
        source: '/en/hongkong/about/going-green/',
        destination: '/en/hongkong/at-east/sustainability/',
        permanent: true,
      },
      {
        source: '/en/hongkong/about/our-neighbourhood/',
        destination: '/en/hongkong/at-east/our-neighbourhood/',
        permanent: true,
      },
      {
        source: '/en/hongkong/beast/',
        destination: '/en/beijing/at-east/wellness-and-fitness/',
        permanent: true,
      },
      {
        source: '/en/hongkong/contact-us/',
        destination: '/en/hongkong/find-us/',
        permanent: true,
      },
      {
        source: '/en/hongkong/gallery/',
        destination: '/en/hongkong/at-east/gallery/',
        permanent: true,
      },
      {
        source: '/en/hongkong/rooms/suite/',
        destination: '/en/hongkong/rooms/harbour-view-suite/',
        permanent: true,
      },
      {
        source: '/sc/hongkong/about/',
        destination: '/sc/hongkong/at-east/',
        permanent: true,
      },
      {
        source: '/sc/hongkong/about/art-and-design/',
        destination: '/sc/hongkong/at-east/',
        permanent: true,
      },
      {
        source: '/sc/hongkong/about/going-green/',
        destination: '/sc/hongkong/at-east/sustainability/',
        permanent: true,
      },
      {
        source: '/sc/hongkong/about/our-neighbourhood/',
        destination: '/sc/hongkong/at-east/our-neighbourhood/',
        permanent: true,
      },
      {
        source: '/sc/hongkong/beast/',
        destination: '/sc/hongkong/at-east/wellness-and-fitness/',
        permanent: true,
      },
      {
        source: '/sc/hongkong/contact-us/',
        destination: '/sc/hongkong/find-us/',
        permanent: true,
      },
      {
        source: '/sc/hongkong/gallery/',
        destination: '/sc/hongkong/at-east/gallery/',
        permanent: true,
      },
      {
        source: '/sc/hongkong/rooms/suite/',
        destination: '/sc/hongkong/rooms/harbour-view-suite/',
        permanent: true,
      },
      {
        source: '/tc/hongkong/about/',
        destination: '/tc/hongkong/at-east/',
        permanent: true,
      },
      {
        source: '/tc/hongkong/about/art-and-design/',
        destination: '/tc/hongkong/at-east/',
        permanent: true,
      },
      {
        source: '/tc/hongkong/about/going-green/',
        destination: '/tc/hongkong/at-east/sustainability/',
        permanent: true,
      },
      {
        source: '/tc/hongkong/about/our-neighbourhood/',
        destination: '/tc/hongkong/at-east/our-neighbourhood/',
        permanent: true,
      },
      {
        source: '/tc/hongkong/beast/',
        destination: '/tc/beijing/at-east/wellness-and-fitness/',
        permanent: true,
      },
      {
        source: '/tc/hongkong/contact-us/',
        destination: '/tc/hongkong/find-us/',
        permanent: true,
      },
      {
        source: '/tc/hongkong/gallery/',
        destination: '/tc/hongkong/at-east/gallery/',
        permanent: true,
      },
      {
        source: '/tc/hongkong/rooms/suite/',
        destination: '/tc/hongkong/rooms/harbour-view-suite/',
        permanent: true,
      },
    ];
  },
};

module.exports = () => {
  // Run the base config through any configured plugins
  return Object.values(plugins).reduce((acc, plugin) => plugin(acc), nextConfig);
};
