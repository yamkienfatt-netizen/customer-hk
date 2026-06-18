import React, { useState } from 'react';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import FadeInUp from 'components/easthotels/Animation/FadeInUp';
import { motion, AnimatePresence } from 'framer-motion';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import {
  LayoutServicePageState,
  useSitecoreContext,
  withDatasourceCheck,
  Image as ScImage,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { _Image } from '@/props/common/_Image';
import { Treelist } from '@/props/fields/ScField';
import { NextArrow, PrevArrow } from '../CustomTypes/Components/Arrow';
import useArrow from '@/hooks/useArrow';
import { _PageMetadata } from '@/props/common/_PageMetadata';
import { PageRouteFields } from '@/props/Core/PageProps';
import { CarouselBanner7Props } from '@/props/Media/CarouselBannerProps';
import ComponentError from '../Error/ComponentError';

const Default = (carouselBanner7Props: CarouselBanner7Props) => {
  try {
    const { sitecoreContext } = useSitecoreContext();
    const isPageEditing = sitecoreContext.pageState === LayoutServicePageState.Edit;

    // set dynamic margin pattern based on number of images
    const marginPattern1 = carouselBanner7Props.fields?.SelectedImages.map((menuItem, index) => {
      if ((index + 1) % 4 === 0) {
        return 80;
      } else if (index % 2 === 0) {
        return 30;
      } else {
        return 0;
      }
    });
    const marginPattern2 = marginPattern1
      ? marginPattern1.map((value, index) => {
          if (index < marginPattern1.length - 1) {
            return marginPattern1[index + 1];
          }
          return marginPattern1[0] + 30;
        })
      : 30;

    const [marginPattern, setMarginPattern] = useState(marginPattern1);

    const handleSlideChange = (swiper) => {
      const currentIndex = swiper.realIndex;

      if (currentIndex % 4 === 0 || currentIndex % 4 === 1) {
        setMarginPattern(marginPattern1);
      } else {
        setMarginPattern(marginPattern2);
      }
    };

    const context = useSitecoreContext();
    const { route } = context.sitecoreContext;
    const pageFields = route?.fields as PageRouteFields & _PageMetadata;

    const { arrowColor } = useArrow(
      pageFields.IsPropertyInnerPage.value,
      pageFields.IsBrandInnerPage.value
    );

    const sitecoreCss = carouselBanner7Props.params?.Styles ?? '';

    return (
      <FadeInUp>
        <div className={'small-section-container ' + sitecoreCss}>
          <div className="flex justify-center md:ml-[50px] xl:ml-0">
            <div className="max-w-fit overflow-hidden">
              <PrevArrow className={`carousel7-prev-arrow ${arrowColor}`} />
              <Swiper
                slidesPerView={'auto'}
                spaceBetween={30}
                slidesPerGroup={2}
                // slidesOffsetBefore={30}
                // slidesOffsetAfter={30}
                navigation={{
                  nextEl: '.carousel7-next-arrow',
                  prevEl: '.carousel7-prev-arrow',
                }}
                modules={[Navigation]}
                className="carousel7 h-[100%]"
                onSlideChange={handleSlideChange}
              >
                {carouselBanner7Props.fields?.SelectedImages.map(
                  (item: Treelist<_Image>, index) => (
                    <SwiperSlide key={index} className="first:ml-[30px] last:mr-[30px]">
                      <AnimatePresence mode="wait">
                        {isPageEditing ? (
                          <ScImage key={index} field={item.fields.Image} className="w-[250px]" />
                        ) : (
                          <motion.img
                            key={index}
                            src={item.fields.Image.value?.src}
                            alt={index + 'MenuItem'}
                            className="w-[250px]"
                            initial={{ marginTop: marginPattern[index] }}
                            animate={{ marginTop: marginPattern[index] }}
                            exit={{ marginTop: marginPattern[index] }}
                            transition={{
                              duration: 0.3,
                              ease: 'easeInOut',
                              stiffness: 50,
                            }}
                          />
                        )}
                      </AnimatePresence>
                    </SwiperSlide>
                  )
                )}
                <NextArrow className={`carousel7-next-arrow  ${arrowColor}`} />
              </Swiper>
            </div>
          </div>
        </div>
      </FadeInUp>
      // <FadeInUp>
      //   <div className={'small-section-container ' + sitecoreCss}>
      //     <div className="flex justify-center md:ml-[50px] xl:ml-0">
      //       <div className="max-w-fit overflow-hidden">
      //         <PrevArrow className={`carousel7-prev-arrow ${arrowColor}`} />
      //         <Swiper
      //           slidesPerView={'auto'}
      //           spaceBetween={30}
      //           slidesPerGroup={2}
      //           slidesOffsetBefore={30}
      //           slidesOffsetAfter={30}
      //           navigation={{
      //             nextEl: '.carousel7-next-arrow',
      //             prevEl: '.carousel7-prev-arrow',
      //           }}
      //           modules={[Navigation]}
      //           className="carousel7 h-[100%]"
      //           onSlideChange={handleSlideChange}
      //         >
      //           {carouselBanner7Props.fields?.SelectedImages.map(
      //             (item: Treelist<_Image>, index) => (
      //               <SwiperSlide key={index}>
      //                 <AnimatePresence mode="wait">
      //                   {isPageEditing ? (
      //                     <ScImage key={index} field={item.fields.Image} className="w-[250px]" />
      //                   ) : (
      //                     <motion.img
      //                       key={index}
      //                       src={item.fields.Image.value?.src}
      //                       alt={index + 'MenuItem'}
      //                       className="w-[250px]"
      //                       initial={{ marginTop: marginPattern[index] }}
      //                       animate={{ marginTop: marginPattern[index] }}
      //                       exit={{ marginTop: marginPattern[index] }}
      //                       transition={{
      //                         duration: 0.3,
      //                         ease: 'easeInOut',
      //                         stiffness: 50,
      //                       }}
      //                     />
      //                   )}
      //                 </AnimatePresence>
      //               </SwiperSlide>
      //             )
      //           )}
      //           <NextArrow className={`carousel7-next-arrow  ${arrowColor}`} />
      //         </Swiper>
      //       </div>
      //     </div>
      //   </div>
      // </FadeInUp>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default withDatasourceCheck()<CarouselBanner7Props>(Default);
