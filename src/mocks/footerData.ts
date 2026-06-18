import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';

const publicUrl = getPublicUrl();
export const footerData = {
  logoUrl: `${publicUrl}/east-logo.png`,
  cities: [
    { label: 'HONG KONG', url: '/hk' },
    { label: 'BEIJING', url: '/beijing' },
    { label: 'MIAMI', url: '/miami' },
  ],
  links: [
    { label: 'MEDIA', url: '/media' },
    { label: 'WORK WITH US', url: '/work' },
    { label: 'PRIVACY POLICY', url: '/privacy' },
    { label: 'COOKIES POLICY', url: '/cookies' },
  ],
  ictLicense: 'ICP License: 京ICP备2023010783号-1 | Gongan Beian: 11010502052636',
  copyright: '© 2023 Swire Properties Hotel Management Limited. All Rights Reserved.',
  stayConnectedText: {
    title: 'STAY CONNECTED',
    inputFieldPlaceholder: 'Your Email Address',
  },
};
