import React, { JSX } from 'react';
import QuoteSection from '../Event/QuoteSection';
import HorizontalScrollCarousel from '../Animation/HorizontalScrollCarousel';
import { _cta } from '@/props/common/_cta';
import { PillarBannerProps } from '@/props/media/PillarBannerProps';
import BannerTextSection from '../Banner/BannerTextSection';
import ImageRevealAnimation from '../Animation/ImageRevealAnimation';
import ComponentError from '../Error/ComponentError';

export const Default = (pillarBannerProps: PillarBannerProps): JSX.Element => {
  try {
    const sitecoreCss = pillarBannerProps.params?.Styles ?? '';
    return (
      <div className={`medium-section-container lg:!max-w-[1440px] ${sitecoreCss}`}>
        {pillarBannerProps.fields?.Quote?.value && (
          <div className="mb-[50px] flex lg:mb-[120px] lg:justify-center">
            <QuoteSection {...pillarBannerProps.fields} />
          </div>
        )}

        <div className="flex flex-col items-center justify-between overflow-hidden lg:hidden">
          <HorizontalScrollCarousel>
            <ImageRevealAnimation
              scImage={pillarBannerProps.fields.LeftImage}
              className="h-[386px]  min-w-[322px] "
              srcSetArr={[{ mw: 322 }]}
              sizes="322px"
            />
            <div className="mt-[65px]">
              <ImageRevealAnimation
                scImage={pillarBannerProps.fields.RightImage}
                className="h-[386px]  min-w-[322px] "
                srcSetArr={[{ mw: 322 }]}
                sizes="322px"
              />
            </div>
          </HorizontalScrollCarousel>
          <div className="mx-[15px] mt-[80px]">
            <BannerTextSection {...pillarBannerProps.fields} />
          </div>
        </div>
        <div className="mx-[15px] hidden  justify-between gap-8 lg:mx-[50px] lg:flex">
          <div className="mt-[50px] lg:mt-[120px] lg:w-[500px]">
            <BannerTextSection {...pillarBannerProps.fields} />
          </div>
          <div className="flex justify-between">
            <div className="mr-[10px] mt-[210px]">
              <ImageRevealAnimation
                scImage={pillarBannerProps.fields.LeftImage}
                className="h-[442px] w-[287px]"
                srcSetArr={[{ mw: 287 }]}
                sizes="287px"
              />
            </div>
            <ImageRevealAnimation
              scImage={pillarBannerProps.fields.RightImage}
              className="h-[442px] w-[287px]"
              srcSetArr={[{ mw: 287 }]}
              sizes="287px"
            />
          </div>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};
