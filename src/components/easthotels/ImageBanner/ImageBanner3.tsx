import React, { useRef, JSX } from 'react';
import HorizontalScrollCarousel from '../Animation/HorizontalScrollCarousel';
import { _cta } from '@/props/common/_cta';
import { ImageBanner3Props } from '@/props/Media/ImageBannerProps';
import ImageRevealAnimation from '../Animation/ImageRevealAnimation';
import BannerTextSectionContent from 'components/easthotels/Banner/BannerTextSectionContent';
import FadeInUp from 'components/easthotels/Animation/FadeInUp';
import HeaderSection from 'components/easthotels/Navigation/HeaderSection';
import { TextField, withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import BannerTextSectionHeader from '../Banner/BannerTextSectionHeader';
import ComponentError from '../Error/ComponentError';
import { cn } from 'lib/utils';
export const Default = (ImageBanner3Props: ImageBanner3Props): JSX.Element => {
  try {
    const AnimationComponent = FadeInUp;

    const sitecoreCss = ImageBanner3Props.params?.Styles ?? '';
    const isMobileReverted = ImageBanner3Props.fields.IsMobileRevertedLayout.value;

    return (
      <div className={`medium-section-container lg:!max-w-[1440px] ${sitecoreCss}`}>
        <div className="overflow-hidden lg:hidden">
          <div className={cn('flex flex-col', isMobileReverted && 'flex-col-reverse')}>
            <div className="w-full">
              <div className="mx-[15px]">
                <BannerTextSectionHeader {...ImageBanner3Props.fields} headerPaddingBtm={40} />
              </div>
            </div>
            <div
              className={cn('mb-[40px] flex w-full flex-row', isMobileReverted && 'justify-center')}
            >
              <ImageRevealAnimation
                scImage={ImageBanner3Props?.fields?.RightImage}
                containerClassName={cn(
                  'relative',
                  isMobileReverted ? 'aspect-[375/302] w-full' : 'aspect-[1.3] w-[80%] ml-auto'
                )}
                className="h-full w-full"
                srcSetArr={[{ mw: 432 }]}
                sizes="432px"
              />
            </div>
          </div>

          <div className={cn('mx-[15px]', isMobileReverted && 'mb-[40px]')}>
            <BannerTextSectionContent {...ImageBanner3Props.fields} />
          </div>

          {isMobileReverted && (
            <div className={cn('relative mb-[40px] flex flex-row justify-center px-[15px]')}>
              <div className={cn('aspect-[319/477] w-full')}>
                <ImageRevealAnimation
                  scImage={ImageBanner3Props?.fields?.LeftImage}
                  srcSetArr={[{ mw: 432 }]}
                  sizes="432px"
                />
              </div>
            </div>
          )}
        </div>

        <div className="hidden overflow-hidden lg:mx-[50px] lg:flex">
          <div className="pt-[88px]">
            <div className="mb-[100px] w-[370px]">
              <AnimationComponent>
                <HeaderSection
                  heading1=""
                  heading2={ImageBanner3Props?.fields?.Heading as TextField}
                />
              </AnimationComponent>
            </div>
            <div className="h-[445px] w-[335px]">
              <ImageRevealAnimation
                scImage={ImageBanner3Props?.fields?.LeftImage}
                srcSetArr={[{ mw: 335 }]}
                sizes="335px"
              />
            </div>
          </div>
          {/* <div className="w-[104px]" /> */}

          <div className="flex flex-1 flex-col items-end">
            <div className=" w-[790px]">
              <div className="flex justify-end ">
                <div className="w-[690px]">
                  <ImageRevealAnimation
                    scImage={ImageBanner3Props?.fields?.RightImage}
                    srcSetArr={[{ mw: 690 }]}
                    sizes="690px"
                  />
                </div>
              </div>
              <div className="mt-[60px]">
                <AnimationComponent>
                  <div className="w-[500px] ">
                    <BannerTextSectionContent {...ImageBanner3Props.fields} />
                  </div>
                </AnimationComponent>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default withDatasourceCheck()<ImageBanner3Props>(Default);
