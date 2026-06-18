import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';

const publicUrl = getPublicUrl();
export const PillarBanner2Data = {
  quoteSection: {
    quote: 'THE HARDEST THING TO FIND IS A PLACE THAT WORKS FOR ME.',
    personName: 'James Tolich',
    personJobTitle: 'Photographer & Director',
  },
  leftImage: {
    src: `${publicUrl}/fitness-piller-left.png`,
    alt: 'Left Image 1',
  },
  rightImage: {
    src: `${publicUrl}/fitness-piller-right.png`,
    alt: 'Right Image 1',
  },

  BannerText: {
    heading: 'FOR THOSE WHO ALWAYS BELIEVE IN A BETTER WAY',
    subheading: 'IT ALL STARTS WITH HEALTH.',
    description:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet',
  },
  cta: {
    url: 'https://example.com',
    text: 'EXPLORE FITNESS',
  },
};

export type PillarBanner2Props = {
  PillarBanner2Data: {
    quoteSection: {
      quote: string;
      personName: string;
      personJobTitle: string;
    };
    leftImage: {
      src: string;
      alt: string;
    };
    rightImage: {
      src: string;
      alt: string;
    };
    BannerText: {
      heading: string;
      subheading: string;
      description: string;
    };
    cta: {
      url: string;
      text: string;
    };
  };
};
