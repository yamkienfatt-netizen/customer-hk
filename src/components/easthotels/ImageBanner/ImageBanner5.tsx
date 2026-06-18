import { ImageBanner5Props } from '@/props/Media/ImageBannerProps';
import React, { useRef, JSX } from 'react';

import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import { useScroll, useTransform } from 'framer-motion';
import ImageClipPath from 'components/easthotels/Animation/ImageClipPath';
import Typography from 'components/easthotels/Typography/Typography';
import {
  Text as ScText,
  Image as ScImage,
  useSitecoreContext,
  LayoutServicePageState,
} from '@sitecore-jss/sitecore-jss-nextjs';
import FadeInLeftToRight from 'components/easthotels/Animation/FadeInLeftToRight';
import BannerTextSectionContent from 'components/easthotels/Banner/BannerTextSectionContent';
import ComponentError from '../Error/ComponentError';
const publicUrl = getPublicUrl();

const BannerText = (ImageBanner5Data: ImageBanner5Props) => {
  try {
    return (
      <div className="mx-auto flex max-w-[1440px] flex-col lg:items-end">
        <FadeInLeftToRight>
          <div className="md:w-[400px]">
            <div className="pb-[60px] lg:pb-[80px]">
              <Typography variant="h1" font="Bellefair">
                <ScText field={ImageBanner5Data.fields.Heading} />
              </Typography>
            </div>

            <BannerTextSectionContent {...ImageBanner5Data.fields} fontColor={'white'} />
          </div>
        </FadeInLeftToRight>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};
export const Default = (ImageBanner5Data: ImageBanner5Props): JSX.Element => {
  try {
    const { sitecoreContext } = useSitecoreContext();
    const target = useRef(null);
    const { scrollYProgress } = useScroll({
      target,
      offset: ['start end', 'end end'],
    });

    const clipPath = useTransform(scrollYProgress, [0, 0.8], ['inset(10%)', 'inset(0%)']);
    const isPageEditing = sitecoreContext.pageState === LayoutServicePageState.Edit;
    const sitecoreCss = ImageBanner5Data.params?.Styles ?? '';
    return (
      <div className={`full-width-section-container ${sitecoreCss} relative`} ref={target}>
        <div className="absolute bottom-0  left-[15px] right-[15px] top-[20%] z-10 text-white lg:left-0 lg:right-[50px]">
          <BannerText fields={ImageBanner5Data.fields} />
        </div>
        <ImageClipPath clipPath={clipPath}>
          <div className="h-[580px]">
            <ScImage
              field={ImageBanner5Data.fields.Image}
              className="h-full w-full object-cover"
              srcSet={[{ mw: 1920 }]}
              sizes="1920px"
            />
            {/* Disable this gradient background in page editing */}
            {!isPageEditing && (
              <div className="absolute inset-0 bg-gradient-to-l from-[#000000a3] to-transparent"></div>
            )}
          </div>
        </ImageClipPath>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};
