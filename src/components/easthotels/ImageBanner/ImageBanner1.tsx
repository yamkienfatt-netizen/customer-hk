import React, { useRef, JSX } from 'react';
import { ImageBanner1Props } from '@/props/Media/ImageBannerProps';

import BannerTextSectionContent from '../Banner/BannerTextSectionContent';
import FadeInUp from '../Animation/FadeInUp';
import ImageRevealAnimation from '../Animation/ImageRevealAnimation';
import HeaderSection from '../Navigation/HeaderSection';
import { ImageFieldValue, TextField } from '@sitecore-jss/sitecore-jss-nextjs';
import ComponentError from '../Error/ComponentError';
import { cn } from 'lib/utils';

export const Default = (ImageBanner1Props: ImageBanner1Props): JSX.Element => {
  try {
    const sitecoreCss = ImageBanner1Props.params?.Styles ?? '';
    const imgs = ImageBanner1Props.fields;
    const isImgExist = (val: ImageFieldValue | undefined) => {
      return val && Object.keys(val).length > 0 && val.constructor === Object;
    };

    return (
      <div className={`medium-section-container_1440 ${sitecoreCss}`}>
        <div className="flex justify-end overflow-hidden lg:justify-center lg:gap-[10px]">
          {(isImgExist(imgs.Image1.value) ||
            isImgExist(imgs.Image2.value) ||
            isImgExist(imgs.Image3.value)) && (
            <ImageRevealAnimation
              scImage={
                isImgExist(imgs.Image1.value)
                  ? imgs.Image1
                  : isImgExist(imgs.Image2.value)
                    ? imgs.Image2
                    : imgs.Image3
              }
              className="h-full w-full object-cover"
              containerClassName={cn('relative h-[300px] w-[300px] lg:hidden')}
              srcSetArr={[{ mw: 300 }]}
              sizes="300px"
            />
          )}

          {isImgExist(imgs.Image1.value) && (
            <ImageRevealAnimation
              scImage={ImageBanner1Props.fields.Image1}
              className="h-full w-full object-cover"
              containerClassName={cn('relative aspect-[387/555] w-[387px] hidden lg:block')}
              srcSetArr={[{ mw: 387 }]}
              sizes="387px"
            />
          )}
          {isImgExist(imgs.Image2.value) && (
            <ImageRevealAnimation
              scImage={ImageBanner1Props.fields.Image2}
              className="mt-[40px] h-full w-full object-cover"
              containerClassName={cn('relative aspect-[387/555] w-[387px] hidden lg:block')}
              srcSetArr={[{ mw: 387 }]}
              sizes="387px"
            />
          )}
          {isImgExist(imgs.Image3.value) && (
            <ImageRevealAnimation
              scImage={ImageBanner1Props.fields.Image3}
              className="mt-[80px] h-full w-full object-cover"
              containerClassName={cn('relative aspect-[387/555] w-[387px] hidden lg:block')}
              srcSetArr={[{ mw: 387 }]}
              sizes="387px"
            />
          )}
        </div>
        <FadeInUp>
          <div className="mx-[15px] mt-[50px] lg:mx-[50px] lg:mt-[60px] lg:flex lg:justify-around">
            <HeaderSection
              heading1={ImageBanner1Props.fields.Heading1 as TextField}
              heading2={ImageBanner1Props.fields.Heading2 as TextField}
              className="mt-[20px] flex gap-[10px]"
            />

            <div className="lg:mt-[20px]">
              <BannerTextSectionContent
                {...ImageBanner1Props.fields}
                isDescriptionRichText={true}
              />
            </div>
          </div>
        </FadeInUp>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};
