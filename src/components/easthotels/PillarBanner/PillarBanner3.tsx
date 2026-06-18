import React, { useRef, JSX } from 'react';
import useWindowSize from 'src/hooks/useWindowSize';
import { PillarBannerProps } from '@/props/media/PillarBannerProps';
import BannerTextSection from '../Banner/BannerTextSection';
import QuoteSection from '../Event/QuoteSection';
import Typography from '../Typography/Typography';
import ImageRevealAnimation from '../Animation/ImageRevealAnimation';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { _BannerWithCta } from '@/props/common/_BannerWithCta';
import FadeInUp from 'components/easthotels/Animation/FadeInUp';
import ComponentError from '../Error/ComponentError';

export const Default = (pillarBannerData: PillarBannerProps): JSX.Element => {
  try {
    const { isMobile } = useWindowSize();
    const filteredFields: _BannerWithCta = isMobile
      ? pillarBannerData.fields
      : {
          ...pillarBannerData.fields,
          Heading: undefined,
        };
    const sitecoreCss = pillarBannerData.params?.Styles ?? '';
    return (
      <div className={`medium-section-container ${sitecoreCss}  relative lg:mb-[200px]`}>
        <div className="mx-[15px] hidden max-w-[792px] lg:mx-[50px] lg:block">
          <FadeInUp>
            <Typography variant="h1" font="Bellefair">
              <Text field={pillarBannerData.fields.Heading} />
            </Typography>
          </FadeInUp>
        </div>
        <div className="flex flex-col justify-between overflow-hidden lg:flex-row lg:space-x-[3%]">
          <>
            <div className="lg:mt-[160px]">
              <ImageRevealAnimation
                scImage={pillarBannerData.fields.LeftImage}
                className="h-[300px] w-[300px] lg:h-full lg:w-[365px]"
                srcSetArr={[{ mw: 365 }, { mw: 300 }]}
                sizes="(min-width: 992px) 365px, 300px"
              />
            </div>
            <div className="flex py-[60px] lg:items-center lg:justify-center lg:py-0">
              <QuoteSection {...pillarBannerData.fields} />
            </div>
            <div className="flex justify-end">
              <ImageRevealAnimation
                scImage={pillarBannerData.fields.RightImage}
                className="h-[300px] w-[300px] lg:h-full lg:w-[365px]"
                srcSetArr={[{ mw: 365 }, { mw: 300 }]}
                sizes="(min-width: 992px) 365px, 300px"
              />
            </div>
          </>
        </div>
        <div className="mx-[15px] mt-[60px] lg:absolute lg:bottom-[-88px] lg:right-[50px] lg:mt-0 lg:w-[500px] xl:w-[600px]">
          <BannerTextSection {...filteredFields} />
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};
