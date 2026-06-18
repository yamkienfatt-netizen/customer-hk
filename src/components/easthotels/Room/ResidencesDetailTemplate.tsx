import React from 'react';
import ImageBanner11 from '../ImageBanner/ImageBanner11';
import CarouselBanner6 from '../CarouselBanner/CarouselBanner6';
import RoomInfoTemplate from './RoomInfoTemplate';
import ComponentError from '../Error/ComponentError';

const IMAGE_BANNER_11_DATA = {
  fields: {
    BannerCTAText: {
      value: 'ENQUIRE NOW',
    },
    BannerCTAUrl: {
      value: {
        href: 'https://example.com',
        linktype: 'external',
        url: 'https://example.com',
      },
    },
    Description: {
      value:
        'Ideal for families, our sleek EAST Residences Two-bedroom Suites offer all the privacy and comfort you need in a full-furnished and convenient package. You’ll feel right at home with a bright and sunny living area and a big modern kitchen that makes cooking simple and easy. The master bedroom includes a deluxe walk-in closet and spa-inspired en suite.',
    },
    Heading: {
      value: 'TWO-BEDROOM SUITES',
    },
    LeftImage: {
      value: {
        alt: 'img_residence_2',
        height: '445',
        src: 'https://xmc-swirehotels1-swirehotels-sit.sitecorecloud.io/-/media/Project/EAST-Hotels/Home/ImageBanner3/img_residence_2.jpg?h=445&iar=0&w=335&hash=E0A01942CC60794EF60DA86A312C1BE1',
        width: '335',
      },
    },
    RightImage: {
      value: {
        alt: 'img_residence_1',
        height: '516',
        src: 'https://xmc-swirehotels1-swirehotels-sit.sitecorecloud.io/-/media/Project/EAST-Hotels/Home/ImageBanner3/img_residence_1.jpg?h=516&iar=0&w=690&hash=AAA194D2573C7C0DE86F76018E0C2820',
        width: '690',
      },
    },
    Subheading: {
      value: 'THE EXPERIENCE OF COMFORT AND TOGETHERNESS',
    },
  },
};

const CAROUSEL_BANNER_6_DATA = {
  fields: {
    SelectedBannerImages: [
      {
        displayName: 'Image 1',
        fields: {
          Image: {
            value: {
              alt: '',
              height: '618',
              src: 'https://xmc-swirehotels1-swirehotels-sit.sitecorecloud.io/-/media/Project/EAST-Hotels/Placeholders/dummy_850x618.png?h=618&iar=0&w=850&hash=379E9364B30768CBC0CD20F9A63B4BA2',
              width: '850',
            },
          },
          id: '4c4726e1-9bd2-46b6-b1e3-377a996886e3',
          name: 'Image 1',
          url: 'https://east.shg.local/EastStoriesListing/EastStories1/Data/Carousel-Banner-6/Image-1',
        },
      },
      {
        displayName: 'Image 2',
        fields: {
          Image: {
            value: {
              alt: '',
              height: '618',
              src: 'https://xmc-swirehotels1-swirehotels-sit.sitecorecloud.io/-/media/Project/EAST-Hotels/Placeholders/dummy_850x618.png?h=618&iar=0&w=850&hash=379E9364B30768CBC0CD20F9A63B4BA2',
              width: '850',
            },
          },
          id: '4f206ac0-8872-4a3c-831b-f24631445fc0',
          name: 'Image 2',
          url: 'https://east.shg.local/EastStoriesListing/EastStories1/Data/Carousel-Banner-6/Image-2',
        },
      },
      {
        displayName: 'Image 3',
        fields: {
          Image: {
            value: {
              alt: '',
              height: '618',
              src: 'https://xmc-swirehotels1-swirehotels-sit.sitecorecloud.io/-/media/Project/EAST-Hotels/Placeholders/dummy_850x618.png?h=618&iar=0&w=850&hash=379E9364B30768CBC0CD20F9A63B4BA2',
              width: '850',
            },
          },
          id: 'e709d0a9-52b4-4548-857b-19b9a19fa6ab',
          name: 'Image 3',
          url: 'https://east.shg.local/EastStoriesListing/EastStories1/Data/Carousel-Banner-6/Image-3',
        },
      },
    ],
  },
};

const ResidencesDetailTemplate = () => {
  try {
    return (
      <div className="medium-section-container">
        <ImageBanner11 {...IMAGE_BANNER_11_DATA} />
        <CarouselBanner6 {...CAROUSEL_BANNER_6_DATA} />
        <RoomInfoTemplate />

        {/* <div className="sticky bottom-0 lg:hidden">
          <CTAButton
            variant="contained-big"
            url={IMAGE_BANNER_11_DATA.fields.BannerCTAUrl}
            text={IMAGE_BANNER_11_DATA.fields.BannerCTAText}
            extraStyles="w-full min-h-[50px]"
          ></CTAButton>
        </div> */}
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />
  }
};

export default ResidencesDetailTemplate;
