import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';

const publicUrl = getPublicUrl();
export const PillarBanner3Data = {
  quoteSection: {
    quote: 'SOMETIMES I NEED A PLACE TO DO NOTHING. IT’S WHERE I GET MY MOST DONE.',
    personName: 'James Tolich',
    personJobTitle: 'Photographer & Director',
  },
  Image1: {
    src: `${publicUrl}/design-pillar1.png`,
    alt: 'Left Image 1',
  },
  Image2: {
    src: `${publicUrl}/design-pillar2.png`,
    alt: 'Right Image 1',
  },

  BannerText: {
    heading: 'GREAT DESIGN IS ALL YOU NEED. NOTHING MORE.',
    subheading: 'GREAT DESIGN ALWAYS MAKES GOOD SENSE.',
    description:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet',
  },
  cta: {
    url: 'https://example.com',
    text: 'DISCOVER ART & DESIGN AT EAST',
  },
};

export type PillarBanner3Props = {
  PillarBanner3Data: {
    quoteSection: {
      quote: string;
      personName: string;
      personJobTitle: string;
    };
    Image1: {
      src: string;
      alt: string;
    };
    Image2: {
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
