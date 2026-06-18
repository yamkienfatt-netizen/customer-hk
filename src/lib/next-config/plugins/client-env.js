/**
 * @param {import('next').NextConfig} nextConfig
 */
const clientEnvPlugin = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    env: Object.assign({}, nextConfig.env || {}, {
      SABRE_FORM_URL: process.env.SABRE_FORM_URL,
      SABRE_SHG_CHAIN_ID: process.env.SABRE_SHG_CHAIN_ID,
      SABRE_TEST_HOTEL_ID: process.env.SABRE_TEST_HOTEL_ID,
      SABRE_MODE: process.env.SABRE_MODE,
      SABRE_SHG_CHAIN_ID_MAP: process.env.SABRE_SHG_CHAIN_ID_MAP,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      AZURE_AD_B2C_AUTH_DOMAIN: process.env.AZURE_AD_B2C_AUTH_DOMAIN,
      SHOW_LOGIN_ERROR_CTA: process.env.SHOW_LOGIN_ERROR_CTA,
      AZURE_AD_B2C_TENANT_NAME: process.env.AZURE_AD_B2C_TENANT_NAME,
      AZURE_AD_B2C_CLIENT_ID: process.env.AZURE_AD_B2C_CLIENT_ID,
      AZURE_AD_B2C_CLIENT_ID_SC: process.env.AZURE_AD_B2C_CLIENT_ID_SC,
      AZURE_AD_B2C_CLIENT_ID_TC: process.env.AZURE_AD_B2C_CLIENT_ID_TC,
      SSO_REG_DISABLE_MOBILE: process.env.SSO_REG_DISABLE_MOBILE,
      SSO_EMAIL_REGEX: process.env.SSO_EMAIL_REGEX,
      SITECORE_EDGE_CONTEXT_ID: process.env.SITECORE_EDGE_CONTEXT_ID,
      XMCLOUD_MEDIA_LIBRARY_HOST: process.env.XMCLOUD_MEDIA_LIBRARY_HOST,
      CAPTCHA_SCENE_ID: process.env.CAPTCHA_SCENE_ID,
      CAPTCHA_PREFIX_ID: process.env.CAPTCHA_PREFIX_ID,
    }),
  });
};

module.exports = clientEnvPlugin;
