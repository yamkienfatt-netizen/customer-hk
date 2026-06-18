import { MotionValue, useScroll, useTransform } from 'framer-motion';
import React, { useRef, JSX } from 'react';
import Typography from '../Typography/Typography';
import FadeInUp from '../Animation/FadeInUp';
import {
  Field,
  Text as ScText,
  Image as ScImage,
  ImageField,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { LeadInBanner1Props } from '@/props/Media/LeadInBannerProps';
import ImageRevealAnimation from 'components/easthotels/Animation/ImageRevealAnimation';
import { useWindowSize } from '@uidotdev/usehooks';
import ComponentError from '../Error/ComponentError';

const LeftImage = ({
  scImage,
  scrollYProgress,
}: {
  scImage: ImageField;
  scrollYProgress: MotionValue<number>;
}) => {
  try {
    const { width: windowWidth } = useWindowSize();

    let imageWidth = '176px';

    if (windowWidth && windowWidth > 1440 && windowWidth <= 1920) {
      const minWidth = 176;
      const maxWidth = 250;

      // Calculate the width based on the window width using the clamp function
      imageWidth = `clamp(${minWidth}px, ${minWidth + ((windowWidth - 1440) * (maxWidth - minWidth)) / (1920 - 1440)}px, ${maxWidth}px)`;
    } else if (windowWidth && windowWidth > 1920) {
      imageWidth = '276px';
    }

    return (
      <FadeInUp scrollYProgress={scrollYProgress} scrollY={[0.5, 0.7]} translateY={[160, 0]}>
        <ScImage
          //top-[470px]
          className="absolute top-[473px] hidden object-cover lg:block xl:left-[50px]"
          style={{ width: imageWidth }}
          field={scImage}
          srcSet={[{ mw: 250 }]}
          sizes="250px"
        />
      </FadeInUp>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

const RightImage = ({
  scImage,
  scrollYProgress,
}: {
  scImage: ImageField;
  scrollYProgress: MotionValue<number>;
}) => {
  try {
    const { width: windowWidth } = useWindowSize();

    let imageWidth = '176px';

    if (windowWidth && windowWidth > 1440 && windowWidth <= 1920) {
      const minWidth = 176;
      const maxWidth = 250;

      // Calculate the width based on the window width using the clamp function
      imageWidth = `clamp(${minWidth}px, ${minWidth + ((windowWidth - 1440) * (maxWidth - minWidth)) / (1920 - 1440)}px, ${maxWidth}px)`;
    } else if (windowWidth && windowWidth > 1920) {
      imageWidth = '276px';
    }

    return (
      <FadeInUp scrollYProgress={scrollYProgress}>
        <ScImage
          className="m absolute bottom-0 hidden object-cover lg:right-[15px] lg:block xl:right-[50px]"
          style={{ width: imageWidth }}
          field={scImage}
          srcSet={[{ mw: 250 }]}
          sizes="250px"
        />
      </FadeInUp>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};
const BannerText = ({
  heading1,
  heading2,
  logo,
  scrollYProgress,
}: {
  heading1: Field<string>;
  heading2: Field<string>;
  logo: ImageField;
  scrollYProgress: MotionValue<number>;
}) => {
  try {
    return (
      <>
        <FadeInUp className="flex flex-col items-center" scrollYProgress={scrollYProgress}>
          <div className="mt-[50px]  text-center lg:mt-[120px] lg:w-[602px]">
            <Typography variant="h2" font="Bellefair">
              <ScText field={heading1} />
            </Typography>
            <br />
            <Typography variant="h2" font="Bellefair">
              <ScText field={heading2} />
            </Typography>
          </div>
          <ScImage className="mt-[30px] lg:mt-[84px]" field={logo} />
        </FadeInUp>
      </>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export const Default = (leadinBanner1Props: LeadInBanner1Props): JSX.Element => {
  try {
    const target = useRef(null);
    const { scrollYProgress } = useScroll({
      target,
      offset: ['start end', 'end end'],
    });
    const sitecoreCss = leadinBanner1Props.params?.Styles ?? '';
    return (
      <div ref={target} className={`medium-section-container_1440 ${sitecoreCss} relative`}>
        <LeftImage
          scImage={leadinBanner1Props.fields.LeftImage}
          scrollYProgress={scrollYProgress}
        />

        <div className="mx-[15px] flex flex-col items-center lg:mx-0">
          <ImageRevealAnimation
            scImage={leadinBanner1Props.fields.TopImage}
            height={'auto'}
            // className="lg:aspect-[16/7]"
            className="lg:max-w-[510px]"
            srcSetArr={[{ mw: 510 }, { mw: 300 }]}
            sizes="(min-width: 992px) 510px, 300px"
          />
          <BannerText
            heading1={leadinBanner1Props.fields.Heading1}
            heading2={leadinBanner1Props.fields.Heading2}
            logo={leadinBanner1Props.fields.Logo}
            scrollYProgress={scrollYProgress}
          />
        </div>
        <RightImage
          scImage={leadinBanner1Props.fields.RightImage}
          scrollYProgress={scrollYProgress}
        />
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};
