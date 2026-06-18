import HeaderSection from 'components/easthotels/Navigation/HeaderSection';
import React, { useRef, useState,JSX } from 'react';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import {
  Text as ScText,
  Image as ScImage,
  withDatasourceCheck,
  LinkField,
  TextField,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Typography from 'components/easthotels/Typography/Typography';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import CTAButton from 'components/easthotels/Button/CTAButton';
import FadeInUp from 'components/easthotels/Animation/FadeInUp';
import { CarouselBanner3Props } from '@/props/Media/CarouselBannerProps';
import ComponentError from '../Error/ComponentError';
import Image from 'next/image';

const publicUrl = getPublicUrl();

const Default = (carouselBanner3Props: CarouselBanner3Props): JSX.Element => {
  try {
    const [swiperIndex, setSwiperIndex] = useState(0);
    const target = useRef(null);
    const { scrollYProgress } = useScroll({
      target,
      offset: ['start end', 'end end'],
    });
    const sitecoreCss = carouselBanner3Props.params?.Styles ?? '';
    return (
      <div ref={target} className={`medium-section-container ${sitecoreCss}`}>
        <div className="lg:mx-[50px]">
          <div className="flex flex-col lg:mb-[50px] lg:items-center">
            <HeaderSection
              heading1=""
              heading2={carouselBanner3Props?.fields?.Heading2}
              className="mx-[15px] lg:w-[500px] lg:text-center xl:mx-0 "
            />
          </div>
          <FadeInUp scrollYProgress={scrollYProgress}>
            <div className="flex justify-center gap-[40px]" ref={target}>
              <div className="hidden overflow-hidden lg:block lg:aspect-[1.6] lg:w-[760px]">
                <Swiper
                  slidesPerView={1}
                  navigation={{
                    nextEl: '.carousel3-next-arrow',
                    prevEl: '.carousel3-prev-arrow',
                  }}
                  modules={[Navigation]}
                  className="h-[100%] lg:w-[760px]"
                  speed={600}
                  onSlideChange={(swiper) => {
                    setSwiperIndex(swiper.realIndex);
                  }}
                  allowTouchMove={false}
                  loop={true}
                >
                  {carouselBanner3Props?.fields?.SelectedArticles &&
                    carouselBanner3Props.fields.SelectedArticles.map((swiper, index) => (
                      <SwiperSlide key={index}>
                        <ScImage
                          field={swiper.fields.Image}
                          className={'h-full w-full object-fill'}
                          srcSet={[{ mw: 760 }]}
                          sizes="760px"
                        />
                      </SwiperSlide>
                    ))}
                </Swiper>
              </div>
              <div className="overflow-hidden lg:w-[370px]">
                <div className="aspect-[1.6] w-full">
                  <Swiper
                    slidesPerView={1}
                    navigation={{
                      nextEl: '.carousel3-next-arrow',
                      prevEl: '.carousel3-prev-arrow',
                    }}
                    modules={[Navigation]}
                    className="h-[100%]"
                    speed={600}
                    onSwiper={(swiper) => swiper.slideTo(swiperIndex + 1)}
                    allowTouchMove={false}
                    loop={true}
                  >
                    {carouselBanner3Props?.fields?.SelectedArticles &&
                      carouselBanner3Props.fields.SelectedArticles.map((swiper, index) => (
                        <SwiperSlide key={index}>
                          <ScImage
                            field={swiper.fields.Image}
                            className={'object-cover'}
                            srcSet={[{ mw: 370 }, { mw: 540 }]}
                            sizes="(min-width: 992px) 370px, 540px"
                          />
                        </SwiperSlide>
                      ))}
                  </Swiper>
                </div>

                <div className="mx-[15px] flex gap-3 py-[20px] lg:py-[30px] xl:mx-0">
                  <div
                    className="carousel3-prev-arrow h-[100px] w-[100px] border-green-primary"
                    style={{
                      backgroundImage: `url(${publicUrl}/icon_arrow_left_grey.svg)`,
                    }}
                  >
                    {/* <Image
                      src={`${publicUrl}/icon_arrow_left_grey.svg`}
                      alt="left_arrow"
                      className="w-[15px]"
                      width={15}
                      height={30}
                    /> */}
                  </div>
                  <div
                    className="carousel3-next-arrow h-[40px] w-[40px] border-green-primary"
                    style={{
                      backgroundImage: `url(${publicUrl}/icon_arrow_right_grey.svg)`,
                    }}
                  >
                    {/* <Image
                      src={`${publicUrl}/icon_arrow_right_grey.svg`}
                      alt="right_arrow"
                      className="w-[15px]"
                      width={15}
                      height={30}
                    /> */}
                  </div>
                </div>
                {/* replace with BannerTextSectionContent.tsx after sitecore conversion */}
                <AnimatePresence mode="wait">
                  <motion.div
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1, transition: { duration: 0.1 } }}
                    exit={{ opacity: 0.5, transition: { duration: 0.1 } }}
                    key={swiperIndex}
                    className="mx-[15px] xl:mx-0"
                  >
                    <Typography variant="h4">
                      <ScText
                        field={
                          carouselBanner3Props?.fields?.SelectedArticles[swiperIndex]?.fields
                            .Heading
                        }
                      />
                    </Typography>
                    <div className="py-[20px]">
                      <Typography variant="p">
                        <ScText
                          field={
                            carouselBanner3Props?.fields?.SelectedArticles[swiperIndex]?.fields
                              .Description
                          }
                        />
                      </Typography>
                    </div>
                    <CTAButton
                      url={
                        carouselBanner3Props?.fields?.SelectedArticles[swiperIndex]?.fields
                          .BannerCTAUrl as LinkField
                      }
                      text={
                        carouselBanner3Props?.fields?.SelectedArticles[swiperIndex]?.fields
                          .BannerCTAText as TextField
                      }
                      variant="underlined"
                    ></CTAButton>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </FadeInUp>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default withDatasourceCheck()<CarouselBanner3Props>(Default);
