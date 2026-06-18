import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';

const publicUrl = getPublicUrl();
export const SocialMediaPhotoWallData = {
  heading: 'FOLLOW US AT EAST',
  socialLinks: [
    {
      label: 'EAST OFFICIAL',
      icon: `${publicUrl}/IG-logo.png`,
      url: 'https://www.instagram.com',
    },
    {
      label: 'EAST OFFICIAL',
      icon: `${publicUrl}/icon_fb_w.svg`,
      url: 'https://www.facebook.com',
    },
    {
      label: 'EAST OFFICIAL',
      icon: `${publicUrl}/weixin-logo.png`,
      url: 'https://www.weixin.com',
    },
  ],
  quoteSection1: {
    quote:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    personName: 'Kathy Chan',
    personJobTitle: '',
  },
  quoteSection2: {
    quote:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.',
    personName: 'Lydia Wong',
    personJobTitle: 'Mixologist',
  },
  images: {
    image1: `${publicUrl}/photo-wall-1.png`,
    image2: `${publicUrl}/photo-wall-1.png`,
    image3: `${publicUrl}/photo-wall-2.png`,
    image4: `${publicUrl}/photo-wall-3.png`,
    image5: `${publicUrl}/photo-wall-4.png`,
    image6: `${publicUrl}/photo-wall-2.png`,
  },
};
