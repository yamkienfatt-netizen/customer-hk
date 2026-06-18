import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';

const publicUrl = getPublicUrl();

export const LeadInBanner1Data = {
  leftImage: {
    src: `${publicUrl}/lead-in-banner2.png`,
    alt: 'Left Image 1',
  },
  topCenterImage: {
    src: `${publicUrl}/lead-in-banner1.png`,
    alt: 'Top Center Image 1',
  },
  rightImage: {
    // pass empty strings if no data
    src: `${publicUrl}/lead-in-banner3.png`,
    alt: 'right Image 1',
  },
  heading1: 'WE’RE NOT HERE TO BE JUST ANOTHER LUXURY HOTEL.',
  heading2: 'WE’RE PART OF A COLLECTIVE THAT CELEBRATES INDIVIDUALITY.',
  logo: {
    src: `${publicUrl}/east-logo-small.png`,
    alt: 'Logo',
  },
};

export type LeadInBanner1Props = {
  LeadInBanner1Data: {
    leftImage: {
      src: string;
      alt: string;
    };
    topCenterImage: {
      src: string;
      alt: string;
    };
    rightImage: {
      src: string;
      alt: string;
    };
    heading1: string;
    heading2: string;
    logo: {
      src: string;
      alt: string;
    };
  };
};
