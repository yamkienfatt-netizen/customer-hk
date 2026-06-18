import React, { useRef, JSX } from 'react';
import { MotionValue, motion, useScroll, useTransform } from 'framer-motion';
import { Image, ImageField, TextField } from '@sitecore-jss/sitecore-jss-nextjs';
import BannerTextSection from '../Banner/BannerTextSection';
import ImageRevealAnimation from '../Animation/ImageRevealAnimation';
import ImageClipPath from '../Animation/ImageClipPath';
import BannerTextSectionContent from '../Banner/BannerTextSectionContent';
import HeaderSection from '../Navigation/HeaderSection';
import FadeInLeftToRight from '../Animation/FadeInLeftToRight';
import { ImageBanner2Props } from '@/props/Media/ImageBannerProps';
import ComponentError from '../Error/ComponentError';

const GridImage = ({
  scImage,
  className,
  scrollYProgress,
}: {
  scImage: ImageField;
  className?: string;
  isMobile?: boolean;
  scrollYProgress: MotionValue<number>;
}) => {
  try {
    const target = useRef(null);

    const clipPath = useTransform(
      scrollYProgress,
      [0, 1],
      ['inset(15% 15% 15% 15%)', 'inset(0% 0% 0% 0%)']
    );

    const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

    return (
      <div className={`mt-[0px] ${className}`}>
        <motion.div ref={target} style={{ opacity }}>
          <ImageClipPath clipPath={clipPath}>
            <Image
              className="relative h-[300px] w-[300px] object-cover"
              field={scImage}
              srcSet={[{ mw: 300 }]}
              sizes="300px"
            />
          </ImageClipPath>
        </motion.div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

const BannerText = (ImageBanner1Data: ImageBanner2Props) => {
  try {
    return (
      <div className="mt-[50px] lg:mt-[120px]">
        <div className="lg:w-[400px] xl:w-[540px]">
          <div className="mb-[60px] lg:mb-[80px]">
            <HeaderSection
              heading1={ImageBanner1Data.fields.Heading1 as TextField}
              heading2={ImageBanner1Data.fields.Heading2 as TextField}
              animationType="fadeinLeftToRight"
            />
          </div>
        </div>
        <div>
          <FadeInLeftToRight>
            <BannerTextSectionContent
              Subheading={ImageBanner1Data.fields.Subheading}
              Description={ImageBanner1Data.fields.Description}
              BannerCTAUrl={ImageBanner1Data.fields.URL}
              BannerCTAText={ImageBanner1Data.fields.Text}
              isDescriptionRichText={true}
            />
          </FadeInLeftToRight>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export const Default = (ImageBanner1Data: ImageBanner2Props): JSX.Element => {
  try {
    const target1 = useRef(null);
    const target2 = useRef(null);

    const { scrollYProgress: scrollYProgress1 } = useScroll({
      target: target1,
      offset: ['start end', 'end end'],
    });
    const { scrollYProgress: scrollYProgress2 } = useScroll({
      target: target2,
      offset: ['start end', 'end end'],
    });
    const sitecoreCss = ImageBanner1Data.params?.Styles ?? '';

    return (
      <div className={`medium-section-container lg:!max-w-[1440px] ${sitecoreCss}`}>
        <div className="flex flex-col justify-between overflow-hidden lg:hidden">
          {/* selected hero img for mobile */}
          <ImageRevealAnimation
            scImage={ImageBanner1Data.fields.ImageForMobile}
            className="h-[300px] w-[300px]"
            srcSetArr={[{ mw: 300 }]}
            sizes="300px"
          />
          <div className="mx-[15px]">
            <BannerText fields={ImageBanner1Data.fields} />
          </div>
        </div>
        <div className="hidden justify-between  gap-8 lg:mx-[15px] lg:mx-[50px] lg:flex">
          <div className=" lg:w-[400px] xl:w-[640px]">
            <BannerText fields={ImageBanner1Data.fields} />
          </div>
          <div className="flex-col">
            <div ref={target1} className="mb-[10px] flex flex-row gap-[10px]">
              <GridImage
                scImage={ImageBanner1Data.fields.Image1}
                scrollYProgress={scrollYProgress1}
              />
              <GridImage
                scImage={ImageBanner1Data.fields.Image2}
                scrollYProgress={scrollYProgress2}
              />
            </div>
            <div ref={target2} className="flex flex-row gap-[10px]">
              <GridImage
                scImage={ImageBanner1Data.fields.Image3}
                scrollYProgress={scrollYProgress2}
              />
              <GridImage
                scImage={ImageBanner1Data.fields.Image4}
                scrollYProgress={scrollYProgress1}
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
