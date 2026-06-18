import React, { useRef, JSX } from 'react';

import BannerTextSectionContent from '../Banner/BannerTextSectionContent';
import FadeInUp from '../Animation/FadeInUp';
import ImageRevealAnimation from '../Animation/ImageRevealAnimation';
import HeaderSection from '../Navigation/HeaderSection';
import { TextField, Image as ScImage } from '@sitecore-jss/sitecore-jss-nextjs';
import HorizontalScrollCarousel from '../Animation/HorizontalScrollCarousel';
import { ImageBanner10Props } from '@/props/Media/ImageBannerProps';
import ComponentError from '../Error/ComponentError';

export const Default = (ImageBanner10Props: ImageBanner10Props): JSX.Element => {
  try {
    const sitecoreCss = ImageBanner10Props.params?.Styles ?? '';
    return (
      <div className={'medium-section-container lg:!max-w-[1440px] ' + sitecoreCss}>
        <div className="flex justify-end overflow-hidden lg:justify-center lg:gap-[30px]">
          <div className="lg:hidden">
            <HorizontalScrollCarousel endPoint="-4%">
              <div>
                <ScImage
                  field={ImageBanner10Props.fields.Image1}
                  className="min-h-[262px  min-w-[183px]"
                />
              </div>
              <div className="mt-[20px]">
                <ScImage
                  field={ImageBanner10Props.fields.Image2}
                  className="min-h-[262px]  min-w-[183px]"
                />
              </div>
              <div className="mt-[40px]">
                <ScImage
                  field={ImageBanner10Props.fields.Image3}
                  className="min-h-[262px]  min-w-[183px]"
                />
              </div>
            </HorizontalScrollCarousel>
          </div>
          <ImageRevealAnimation
            scImage={ImageBanner10Props.fields.Image1}
            className="hidden lg:block object-cover w-[387px] h-[555px]"
          />
          <ImageRevealAnimation
            scImage={ImageBanner10Props.fields.Image2}
            className=" mt-[40px] hidden lg:block object-cover w-[387px] h-[555px]"
          />
          <ImageRevealAnimation
            scImage={ImageBanner10Props.fields.Image3}
            className="mt-[80px] hidden lg:block object-cover w-[387px] h-[555px]"
          />
        </div>
        <FadeInUp>
          <div className="mx-[15px] mt-[50px] lg:mx-[50px] lg:mt-[60px] lg:flex lg:justify-around">
            <HeaderSection
              heading1={ImageBanner10Props.fields.Heading1 as TextField}
              heading2={ImageBanner10Props.fields.Heading2 as TextField}
              className="mt-[20px] flex flex-wrap gap-[10px]"
            />

            <div className="lg:mt-[20px]">
              <BannerTextSectionContent {...ImageBanner10Props.fields} isDescriptionRichText={true} />
            </div>
          </div>
        </FadeInUp>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};
