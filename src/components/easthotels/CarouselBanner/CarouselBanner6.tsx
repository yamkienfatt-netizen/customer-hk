import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import FadeInUp from 'components/easthotels/Animation/FadeInUp';
import {
  LayoutServicePageState,
  useSitecoreContext,
  withDatasourceCheck,
  Image as ScImage,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { NextArrow, PrevArrow } from '../CustomTypes/Components/Arrow';
import useArrow from '@/hooks/useArrow';
import { _PageMetadata } from '@/props/common/_PageMetadata';
import { PageRouteFields } from '@/props/Core/PageProps';
import { useWindowSize as useWindowSizeHook } from '@uidotdev/usehooks';
import Typography from 'components/easthotels/Typography/Typography';
import { CarouselBanner6Props } from '@/props/Media/CarouselBannerProps';
import ComponentError from '../Error/ComponentError';
import { cn } from 'lib/utils';

// const Default = (carouselBanner6Props: CarouselBanner6Props) => {
const CarouselBanner6 = (carouselBanner6Props: CarouselBanner6Props) => {
  try {
    const { sitecoreContext } = useSitecoreContext();
    const isPageEditing = sitecoreContext.pageState === LayoutServicePageState.Edit;

    const [activeIndex, setActiveIndex] = useState(0);

    const formatPaginationNumber = (number: number) => {
      if (number.toString().length < 2) {
        return '0' + number;
      } else {
        return number;
      }
    };

    const { width: windowWidth } = useWindowSizeHook();
    const isProperty = true;
    const IMAGE_WIDTH = (windowWidth && windowWidth * 0.8) || 345;
    const IMAGE_HEIGHT = IMAGE_WIDTH * 0.7;
    // const IMAGE_HEIGHT = isMobile ? 250 : 618;
    // const IMAGE_WIDTH = isMobile ? 345 : 850;
    const ARROW_SIZE = IMAGE_WIDTH * 0.2;

    const context = useSitecoreContext();
    const { route } = context.sitecoreContext;
    const pageFields = route?.fields as PageRouteFields & _PageMetadata;

    const { arrowColor } = useArrow(
      pageFields.IsPropertyInnerPage.value,
      pageFields.IsBrandInnerPage.value
    );

    const sitecoreCss = carouselBanner6Props.params?.Styles ?? '';

    const previosSlide = useRef(0);

    const direction = activeIndex - previosSlide.current;

    return (
      <FadeInUp>
        <div
          className={cn(
            // 'small-section-container relative flex w-full flex-col justify-center overflow-x-clip',
            'relative mx-[15px] max-w-[1340px] lg:mx-auto',
            sitecoreCss
          )}
        >
          <div className="hidden lg:block">
            <PrevArrow
              className={`carousel6-prev-arrow absolute top-[50%] h-[50px] w-[50px] rounded-full lg:left-[135px] ${arrowColor}`}
              imgClassName={'lg:w-[25px]'}
            />
            <NextArrow
              className={`carousel6-next-arrow absolute top-[50%] h-[50px] w-[50px] rounded-full lg:right-[135px] ${arrowColor}`}
              imgClassName={'lg:w-[25px]'}
            />
          </div>
          <Swiper
            slidesPerView={1}
            spaceBetween={110}
            speed={1000}
            // loop
            onActiveIndexChange={({ realIndex }) => {
              setActiveIndex(realIndex);
              previosSlide.current = activeIndex;
            }}
            navigation={{
              nextEl: '.carousel6-next-arrow',
              prevEl: '.carousel6-prev-arrow',
            }}
            centeredSlides={true}
            pagination={{
              el: '.carousel6-fraction-pagination',
              type: 'fraction',
              formatFractionCurrent: (number) => {
                return formatPaginationNumber(number);
              },
              formatFractionTotal: (number) => {
                return formatPaginationNumber(number);
              },
            }}
            modules={[Pagination, Navigation]}
            // className="carousel4 h-[100%] w-[100%] bg-cyan-500"
            // className="flex min-h-[100px] w-full items-center overflow-x-clip bg-blue-200"
            className={cn('')}
            breakpoints={{
              768: {
                slidesPerView: 1.45,
              },
            }}
          >
            {carouselBanner6Props.fields.SelectedBannerImages.map((banner, index) => {
              return (
                <SwiperSlide key={index} className={''}>
                  {({ isActive }) => (
                    <motion.div className="relative aspect-[1.375] w-full overflow-clip">
                      {isPageEditing ? (
                        <ScImage
                          field={banner.fields.Image}
                          // style={{ height: IMAGE_HEIGHT, width: IMAGE_WIDTH }}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <motion.img
                          src={banner.fields.Image.value?.src}
                          alt="IMG"
                          transition={{ duration: 1, ease: 'easeInOut' }}
                          // style={{ height: IMAGE_HEIGHT, width: IMAGE_WIDTH }}
                          style={{
                            // originX: index < activeIndex ? 1 : 0,
                            originX:
                              index === activeIndex
                                ? direction < 1
                                  ? 1
                                  : 0
                                : index < activeIndex
                                  ? 1
                                  : 0,

                            // originY: index < activeIndex ? 0 : 1,

                            originY:
                              index === activeIndex
                                ? direction < 1
                                  ? 0
                                  : 1
                                : index < activeIndex
                                  ? 0
                                  : 1,
                          }}
                          animate={{
                            scale: isActive ? 1 : 0.5,
                          }}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </motion.div>
                  )}
                </SwiperSlide>
              );
            })}
          </Swiper>

          <div className="flex items-end justify-center gap-3 lg:items-center lg:justify-around lg:gap-0">
            <PrevArrow
              className={`carousel6-prev-arrow max-h-[35px] max-w-[35px] translate-y-2 rounded-full lg:hidden lg:translate-y-0 ${arrowColor}`}
              imgClassName={'w-1/2 max-w-[20px]'}
              containerStyle={{ height: ARROW_SIZE, width: ARROW_SIZE }}
            />
            <Typography variant="l1" fontWeight="bold">
              <div className="carousel6-fraction-pagination mt-5" />
            </Typography>
            <NextArrow
              className={`carousel6-next-arrow max-h-[35px] max-w-[35px] translate-y-2 rounded-full lg:hidden lg:translate-y-0 ${arrowColor}`}
              imgClassName={'w-1/2 max-w-[20px]'}
              containerStyle={{ height: ARROW_SIZE, width: ARROW_SIZE }}
            />
          </div>
        </div>
      </FadeInUp>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

//  Temp commented so to use in ResidencesDetailTemplate, if ResidencesDetailTemplate converted to sitecore component
//  should uncomment the following line

// export default withDatasourceCheck()<CarouselBanner6Props>(Default);
export default CarouselBanner6;
