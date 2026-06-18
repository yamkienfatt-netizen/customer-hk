import React, { useRef, JSX } from 'react';

import { motion, useScroll } from 'framer-motion';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import ListingCard from 'components/easthotels/Article/ListingCard';
import FadeInUp from '../Animation/FadeInUp';
import BannerTextSectionContent from '../Banner/BannerTextSectionContent';
import HeaderSection from '../Navigation/HeaderSection';
import { NextArrow, PrevArrow } from '../CustomTypes/Components/Arrow';
import useArrow from '@/hooks/useArrow';
import { _PageMetadata } from '@/props/common/_PageMetadata';
import { PageRouteFields } from '@/props/Core/PageProps';
import { useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';
import { CarouselBanner1Prop } from '@/props/Media/CarouselBannerProps';
import ComponentError from '../Error/ComponentError';

const publicUrl = getPublicUrl();

const fadeinAnimation = {
  initial: { opacity: 0, y: 40 },
  animate: (index: number) => ({ opacity: 1, y: 0, transition: { delay: index * 0.05 } }),
};

export const Default = (carouselBanner1Prop: CarouselBanner1Prop): JSX.Element => {
  try {
    const sitecoreCss = carouselBanner1Prop.params?.Styles ?? '';
    const context = useSitecoreContext();
    const { route } = context.sitecoreContext;
    const pageFields = route?.fields as PageRouteFields & _PageMetadata;

    const { arrowColor } = useArrow(
      pageFields.IsPropertyInnerPage.value,
      pageFields.IsBrandInnerPage.value
    );

    const target = useRef(null);
    const { t } = useI18n();
    return (
      <div className={`medium-section-container ${sitecoreCss}`}>
        <div className="mx-[15px] lg:mx-0">
          <div
            className="flex flex-col lg:mx-auto lg:max-w-[700px] lg:items-center lg:text-center"
            ref={target}
          >
            <HeaderSection
              heading1={carouselBanner1Prop.fields.Heading1}
              heading2={carouselBanner1Prop.fields.Heading2}
            />
            <FadeInUp>
              <BannerTextSectionContent {...carouselBanner1Prop.fields} />
            </FadeInUp>
          </div>
          <PrevArrow className={`carousel1-prev-arrow ${arrowColor}`} />
          <div className="mx-auto max-w-fit overflow-hidden">
            <Swiper
              slidesPerView={'auto'}
              spaceBetween={30}
              navigation={{
                nextEl: '.carousel1-next-arrow',
                prevEl: '.carousel1-prev-arrow',
              }}
              modules={[Navigation]}
              className="carousel1 h-[100%]"
            >
              {carouselBanner1Prop.fields.SelectedProperties.map((property, index) => {
                const constructedUrl = {
                  URL: property?.fields?.URL ?? property.url,
                  Text: t(DICTIONARY_CONSTANT.CTA.CAROUSELBANNER1_PROPERTY_VIEWDETAIL),
                };
                if (property?.fields?.Text?.value) {
                  constructedUrl.Text = property?.fields?.Text?.value?.toString();
                }

                return (
                  <SwiperSlide key={index}>
                    <motion.div
                      key={index}
                      variants={fadeinAnimation}
                      initial="initial"
                      whileInView="animate"
                      custom={index}
                      // className="w-[260px]"
                    >
                      <ListingCard
                        articleCard={property.fields}
                        cta={constructedUrl}
                        className={'w-[265px]'}
                        imgClassName={'aspect-[0.88] w-[265px] object-cover'}
                        srcSet={[{ mw: 265 }]}
                        sizes="265px"
                      />
                    </motion.div>
                  </SwiperSlide>
                );
              })}

              <NextArrow className={`carousel1-next-arrow ${arrowColor}`} />
            </Swiper>
          </div>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};
