import React, { useRef, JSX } from 'react';
import { motion } from 'framer-motion';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import ListingCard from 'components/easthotels/Article/ListingCard';
import { useSitecoreContext, withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import { useI18n } from 'next-localization';
import HeaderSection from '../Navigation/HeaderSection';
import Arrow, { NextArrow, PrevArrow } from '../CustomTypes/Components/Arrow';
import useArrow from '@/hooks/useArrow';
import { _PageMetadata } from '@/props/common/_PageMetadata';
import { PageRouteFields } from '@/props/Core/PageProps';
import { CarouselBanner4Props } from '@/props/Media/CarouselBannerProps';
import ComponentError from '../Error/ComponentError';

const fadeinAnimation = {
  initial: { opacity: 0, y: 40 },
  animate: (index: number) => ({ opacity: 1, y: 0, transition: { delay: index * 0.05 } }),
};

const Default = (carouselBanner4Props: CarouselBanner4Props): JSX.Element => {
  try {
    const swiperRef = useRef<SwiperInstance>(null);
    const { t, locale } = useI18n();
    const slideNext = () => {
      if (swiperRef.current) {
        swiperRef.current.slideNext();
      }
    };

    const slidePrev = () => {
      if (swiperRef.current) {
        swiperRef.current.slidePrev();
      }
    };

    const context = useSitecoreContext();
    const { route } = context.sitecoreContext;
    const pageFields = route?.fields as PageRouteFields & _PageMetadata;

    const { arrowColor } = useArrow(
      pageFields.IsPropertyInnerPage.value,
      pageFields.IsBrandInnerPage.value
    );

    const getBgStyles = () => {
      if (pageFields.IsPropertyInnerPage.value === true) {
        return 'bg-[#E0DAD2] py-[80px]';
      } else if (pageFields.IsBrandInnerPage.value === true) {
        return 'bg-[#D1D3CE] py-[80px]';
      } else {
        return '';
      }
    };

    const sitecoreCss = carouselBanner4Props.params?.Styles ?? '';

    return (
      <div
        className={`medium-section-container relative  ${sitecoreCss}  lg:flex lg:!max-w-[1440px] lg:gap-[20px] ${getBgStyles()}`}
      >
        <div className="mx-[15px] flex items-center justify-between lg:ml-[50px] lg:mr-0 lg:min-w-[360px]">
          <HeaderSection
            heading1={carouselBanner4Props.fields.Heading1}
            heading2={carouselBanner4Props.fields.Heading2}
            className="mr-[10px]"
            textVariant={'h2'}
          />
          <div className=" hidden lg:block">
            <PrevArrow className={`carousel4-prev-arrow ${arrowColor}`} onClick={slidePrev} />
          </div>
          <div className="flex gap-3 lg:hidden">
            <PrevArrow className={`carousel4-prev-arrow ${arrowColor}`} onClick={slidePrev} />
            <NextArrow className={`carousel4-next-arrow ${arrowColor}`} onClick={slideNext} />
          </div>
        </div>
        <div className="relative overflow-hidden">
          <div className="ml-[15px] overflow-hidden lg:ml-0 lg:mr-[50px]">
            <Swiper
              slidesPerView={'auto'}
              spaceBetween={20}
              navigation={{
                nextEl: '.carousel4-next-arrow',
                prevEl: '.carousel4-prev-arrow',
              }}
              modules={[Navigation]}
              className="carousel4 h-[100%]"
            >
              {carouselBanner4Props.fields.SelectedArticles.map((article, index) => {
                const constructedUrl = {
                  URL: article.url,
                  Text: t(DICTIONARY_CONSTANT.GENERAL.CAROUSEL_BANNER_4_LINK_TEXT),
                };

                return (
                  <SwiperSlide
                    key={index}
                    className="max-w-[80%] lg:max-w-[340px] 2xl:max-w-[calc(1440px*(340/1280))]"
                  >
                    <motion.div
                      key={index}
                      variants={fadeinAnimation}
                      initial="initial"
                      whileInView="animate"
                      custom={index}
                    >
                      <ListingCard
                        articleCard={article.fields}
                        cta={constructedUrl}
                        imgClassName={'w-full aspect-[1.6] object-cover'}
                        isCarouselBanner4={true}
                        srcSet={[{ mw: 383 }, { mw: 420 }]}
                        sizes="(min-width: 992px) 383px, 420px"
                      />
                    </motion.div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
          <div className="hidden lg:flex">
            <NextArrow className={`carousel4-next-arrow ${arrowColor}`} onClick={slideNext} />
          </div>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default withDatasourceCheck()<CarouselBanner4Props>(Default);
