import React, { useRef, JSX } from 'react';
import { PillarBannerProps } from '@/props/media/PillarBannerProps';
import { Image as ScImage, Text as ScText } from '@sitecore-jss/sitecore-jss-nextjs';
import { motion, useScroll, useTransform } from 'framer-motion';
import QuoteSection from '../Event/QuoteSection';
import Typography from '../Typography/Typography';
import FadeInUp from '../Animation/FadeInUp';
import ImageRevealAnimation from '../Animation/ImageRevealAnimation';
import BannerTextSectionContent from '../Banner/BannerTextSectionContent';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import ImageClipPath from 'components/easthotels/Animation/ImageClipPath';
import FadeInRightToLeft from 'components/easthotels/Animation/FadeInRightToLeft';
import ComponentError from '../Error/ComponentError';
import Image from 'next/image';
const publicUrl = getPublicUrl();

export const Default = (pillarBanner1Prop: PillarBannerProps): JSX.Element => {
  try {
    const target = useRef(null);
    const { scrollYProgress } = useScroll({
      target,
      offset: ['start end', 'end end'],
    });

    const targetXRef = useRef(null);
    const targetXRefMobile = useRef(null);
    const { scrollYProgress: scrollXProgress } = useScroll({
      target: targetXRef,
    });
    const { scrollYProgress: ScrollXProgressMobile } = useScroll({
      target: targetXRefMobile,
    });

    const x = useTransform(scrollXProgress, [0, 1], ['18%', '-34%']);
    const mobileX = useTransform(ScrollXProgressMobile, [0, 1], ['0%', '-68%']);
    const Img1LeftToRight = useTransform(scrollXProgress, [0, 1], ['inset(0%)', 'inset(30%)']);
    const Img2LeftToRight = useTransform(scrollXProgress, [0, 1], ['inset(30%)', 'inset(0%)']);

    const Img2LeftToRightMobile = useTransform(
      ScrollXProgressMobile,
      [0, 1],
      ['inset(30%)', 'inset(0%)']
    );
    const sitecoreCss = pillarBanner1Prop.params?.Styles ?? '';

    return (
      <>
        <section
          ref={targetXRef}
          className={`full-width-section-container ${sitecoreCss} hidden h-[300vh] lg:block`}
        >
          <div className="sticky top-0 flex h-screen items-center overflow-hidden">
            <motion.div style={{ x }} className="flex items-center  gap-[110px]">
              <div className="flex-1 flex-none">
                <div ref={target}>
                  <ImageClipPath clipPath={Img1LeftToRight}>
                    <ImageRevealAnimation
                      className="h-[50vh] w-[50vh]"
                      scImage={pillarBanner1Prop.fields.LeftImage}
                      srcSetArr={[{ mw: 474 }]}
                      sizes="474px"
                    />
                  </ImageClipPath>
                </div>
              </div>
              <div className="relative flex-1 flex-none">
                <div className="absolute left-0 top-0 flex min-h-full min-w-full flex-col justify-center">
                  <div className="px-[50px] text-white">
                    <motion.div
                      style={{ y: useTransform(scrollXProgress, [0, 1], ['50%', '-30%']) }}
                    >
                      <FadeInRightToLeft>
                        <Typography variant="h1" font="Bellefair">
                          <ScText field={pillarBanner1Prop.fields.Heading} />
                        </Typography>

                        <div className="mt-[270px]">
                          <QuoteSection type={'bg_big'} {...pillarBanner1Prop.fields} />
                          <div className="pt-[60px] lg:pt-[80px]">
                            <BannerTextSectionContent
                              {...pillarBanner1Prop.fields}
                              fontColor="white"
                            />
                          </div>
                        </div>
                      </FadeInRightToLeft>
                    </motion.div>
                  </div>
                </div>
                <ScImage
                  className="h-[100vh] w-[100vh]"
                  field={pillarBanner1Prop.fields.BackgroundImage}
                />
              </div>
              <div className="flex-1 flex-none" ref={targetXRef}>
                <ImageClipPath clipPath={Img2LeftToRight}>
                  <ScImage
                    className="h-[50vh] w-[50vh]"
                    field={pillarBanner1Prop.fields.RightImage}
                    srcSet={[{ mw: 474 }]}
                    sizes="474px"
                  />
                </ImageClipPath>
              </div>
            </motion.div>
          </div>
        </section>
        <section
          ref={targetXRefMobile}
          className={`full-width-section-container ${sitecoreCss} relative h-[200vh] lg:hidden`}
        >
          <div
            className="absolute sticky top-0 flex h-[680px] h-screen  w-full items-center overflow-hidden
  "
          >
            <Image
              src={`/img_community_bg.jpg`}
              alt="Background"
              className="h-full w-full object-cover"
              fill
            />

            <motion.div
              style={{ x: mobileX }}
              className="absolute mx-[15px] flex items-center gap-[50px]"
            >
              <div className="">
                <div className="relative flex-1 flex-none" ref={target}>
                  <ImageRevealAnimation
                    containerClassName="w-[calc(100vw-30px)] aspect-square"
                    className="h-full w-full"
                    scImage={pillarBanner1Prop.fields.LeftImage}
                    srcSetArr={[{ mw: 962 }]}
                    sizes="962px"
                  ></ImageRevealAnimation>
                  <div className="absolute bottom-[-100px] left-[40%] text-white">
                    <FadeInUp scrollYProgress={scrollYProgress}>
                      <Typography variant="h1" font="Bellefair">
                        <ScText field={pillarBanner1Prop.fields.Heading} />
                      </Typography>
                    </FadeInUp>
                  </div>
                </div>
              </div>
              <div className="w-[325px]">
                <QuoteSection type={'bg_big'} {...pillarBanner1Prop.fields} />
              </div>
              <div className="relative ml-[20px] flex-1 flex-none" ref={target}>
                <ImageClipPath
                  clipPath={Img2LeftToRightMobile}
                  className="relative aspect-square w-[calc(100vw-30px)] bg-slate-200"
                >
                  <ScImage
                    className="h-full w-full"
                    field={pillarBanner1Prop.fields.RightImage}
                    srcSet={[{ mw: 961 }]}
                    sizes="961px"
                  />
                </ImageClipPath>
                <div className="max-w-[300px] pt-[30px]">
                  <FadeInUp scrollYProgress={ScrollXProgressMobile}>
                    <BannerTextSectionContent {...pillarBanner1Prop.fields} fontColor="white" />
                  </FadeInUp>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};
