import React, { JSX } from 'react';
import HorizontalScrollCarousel from '../Animation/HorizontalScrollCarousel';
import { _cta } from '@/props/common/_cta';
import { PillarBannerProps } from '@/props/media/PillarBannerProps';
import BannerTextSection from '../Banner/BannerTextSection';
import ImageRevealAnimation from '../Animation/ImageRevealAnimation';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import ComponentError from '../Error/ComponentError';

const Default = (pillarBannerProps: PillarBannerProps): JSX.Element => {
  try {
    const sitecoreCss = pillarBannerProps.params?.Styles ?? '';
    return (
      <div className={'medium-section-container  ' + sitecoreCss}>
        <div className="flex flex-col items-center justify-between overflow-hidden lg:hidden">
          <div className="aspect-[0.67] w-[84%] self-end">
            <ImageRevealAnimation
              scImage={pillarBannerProps.fields.RightImage}
              className="aspect-[0.67] w-full object-cover"
            />
          </div>
          <div className="mx-[15px] mt-[40px]">
            <BannerTextSection {...pillarBannerProps.fields} headerVariant="h2" />
          </div>
          <div className="mx-[15px] mt-[40px] aspect-square w-[53%] self-start">
            <ImageRevealAnimation
              scImage={pillarBannerProps.fields.LeftImage}
              className="aspect-square w-full object-cover"
            />
          </div>
        </div>

        <div className="mx-[15px] hidden items-center gap-[50px] lg:mx-[50px] lg:flex">
          <div className="flex flex-1 justify-end">
            <BannerTextSection {...pillarBannerProps.fields} headerVariant="h2" />
          </div>

          <div className="flex flex-1 items-center">
            <div className="mr-[12px] aspect-square max-w-[262px]">
              <ImageRevealAnimation
                scImage={pillarBannerProps.fields.LeftImage}
                className="aspect-square w-full object-cover"
              />
            </div>
            <div className="aspect-[0.67] max-w-[365px]">
              <ImageRevealAnimation
                scImage={pillarBannerProps.fields.RightImage}
                className="aspect-[0.67] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default withDatasourceCheck()<PillarBannerProps>(Default);
