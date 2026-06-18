import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { motion } from 'framer-motion';
import useWindowSize from '@/hooks/useWindowSize';
import ListingCard from 'components/easthotels/Article/ListingCard';
import { useSitecoreContext, withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import { EventListingMultipleProps } from '@/props/PageContent/EventListingMultipleProps';
import { NextArrow, PrevArrow } from '../CustomTypes/Components/Arrow';
import useArrow from '@/hooks/useArrow';
import { _PageMetadata } from '@/props/common/_PageMetadata';
import { PageRouteFields } from '@/props/Core/PageProps';
import ComponentError from '../Error/ComponentError';

const fadeinAnimation = {
  initial: { opacity: 0, y: 40 },
  animate: (index: number) => ({ opacity: 1, y: 0, transition: { delay: index * 0.05 } }),
};

const Default = (eventListingMultipleProps: EventListingMultipleProps) => {
  try {
    const windowWidth = useWindowSize().windowSize?.width;
    const sitecoreCss = eventListingMultipleProps.params?.Styles ?? '';
    const context = useSitecoreContext();
    const { route } = context.sitecoreContext;
    const pageFields = route?.fields as PageRouteFields & _PageMetadata;

    const { arrowColor } = useArrow(
      pageFields.IsPropertyInnerPage.value,
      pageFields.IsBrandInnerPage.value
    );

    return (
      <div className={'medium-section-container ' + sitecoreCss}>
        <div
          className={`relative ml-[15px] flex flex-nowrap overflow-x-auto scrollbar-hide lg:pl-[50px] ${~~windowWidth! >= 1500 ? 'lg:pr-[50px]' : 'lg:pr-[0px]'}`}
        >
          <div className="hidden lg:block">
            <PrevArrow
              className={`event-listing-prev-arrow absolute bottom-[293px] left-[30px]  ${arrowColor}`}
            />
            <NextArrow
              className={`event-listing-next-arrow absolute bottom-[293px] right-[30px]  ${arrowColor}`}
            />
          </div>
          <Swiper
            slidesPerView={'auto'}
            spaceBetween={40}
            navigation={{
              nextEl: '.event-listing-next-arrow',
              prevEl: '.event-listing-prev-arrow',
            }}
            modules={[Navigation]}
            className="carousel4 h-[100%] "
          >
            {eventListingMultipleProps?.fields?.SelectedArticles.map((article, index) => {
              const constructedUrl = {
                URL: article.url,
                Text: eventListingMultipleProps.fields.CTAText,
              };

              return (
                <SwiperSlide key={index} className="max-[414px]:!w-[70svw] w-[334px]">
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
                      className={'max-[414px]:w-full w-[334px]'}
                      imgClassName={'w-full object-cover aspect-[334/402]'}
                    />
                  </motion.div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />
  }
};

export default withDatasourceCheck()<EventListingMultipleProps>(Default);
