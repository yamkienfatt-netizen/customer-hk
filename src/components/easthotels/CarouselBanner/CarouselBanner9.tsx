import React, { useState } from 'react';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import FadeInUp from 'components/easthotels/Animation/FadeInUp';
import { motion, AnimatePresence } from 'framer-motion';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, FreeMode } from 'swiper/modules';
// import { sleep } from 'react-query/types/core/utils';
import useWindowSize from 'src/hooks/useWindowSize';
import {
  LayoutServicePageState,
  useSitecoreContext,
  withDatasourceCheck,
  Image as ScImage,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { _Image } from '@/props/common/_Image';
import { Treelist } from '@/props/fields/ScField';
import { CarouselBanner9Props } from '@/props/Media/CarouselBannerProps';
import ComponentError from '../Error/ComponentError';

const Default = (carouselBanner9Props: CarouselBanner9Props) => {
  try {
    const { sitecoreContext } = useSitecoreContext();
    const isPageEditing = sitecoreContext.pageState === LayoutServicePageState.Edit;

    const { isMobile } = useWindowSize();

    const imageArr =
      carouselBanner9Props.fields.SelectedImages.length < 5
        ? carouselBanner9Props.fields.SelectedImages.concat(
            carouselBanner9Props.fields.SelectedImages
          )
        : carouselBanner9Props.fields.SelectedImages;

    // set dynamic margin pattern based on number of images
    const marginPattern1 = imageArr.map((menuItem: Treelist<_Image>, index) => {
      // const imgHeight = Number(menuItem.fields.Image.value?.height);
      const imgHeight = 300;
      const patternIndex = index % 6;

      if (patternIndex == 0) {
        return imgHeight + 30;
      } else if (patternIndex == 3 || patternIndex == 5) {
        return imgHeight + 50;
      } else {
        return imgHeight;
      }
    });

    const marginPattern2 = marginPattern1.map((value, index) => {
      if (index < marginPattern1.length - 1) {
        return marginPattern1[index + 1];
      }
      return marginPattern1[0] + 30;
    });

    const [marginPattern, setMarginPattern] = useState(marginPattern1);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [currentPattern, setCurrentPattern] = useState('1');

    const handleSlideChange = (swiper) => {
      const currentIndex = swiper.realIndex;
      setCurrentSlideIndex(currentIndex);

      if (currentIndex !== currentSlideIndex) {
        if (currentPattern === '1') {
          setMarginPattern(marginPattern2);
          setCurrentPattern('2');
        } else {
          setMarginPattern(marginPattern1);
          setCurrentPattern('1');
        }
      }
    };
    const sitecoreCss = carouselBanner9Props.params?.Styles ?? '';

    const maxImgHeight =
      Math.max(...imageArr.map((item) => ~~(item?.fields?.Image?.value?.height || 0))) + 50;

    return (
      <FadeInUp>
        <div className={'small-section-container ' + sitecoreCss}>
          <div className="overflow-hidden">
            <Swiper
              slidesPerView={'auto'}
              spaceBetween={0}
              allowTouchMove={false}
              // slidesPerGroup={isMobile ? 1 : 2}
              // centeredSlides={isMobile ? true : false}
              modules={[Navigation, Autoplay, FreeMode]}
              className="carousel7 pointer-events-none h-[350px]"
              onSlideChange={handleSlideChange}
              speed={5000}
              loop={true}
              freeMode={true}
              autoplay={{
                delay: 1,
                pauseOnMouseEnter: false,
                disableOnInteraction: false,
              }}
              wrapperClass="!ease-linear"
            >
              {imageArr.map((item: Treelist<_Image>, index) => (
                <SwiperSlide key={index} className="pl-[20px]">
                  {({ isActive }) => (
                    <AnimatePresence mode="wait">
                      {isPageEditing ? (
                        <ScImage
                          field={item.fields.Image}
                          className="!h-auto w-[250px] select-none"
                        />
                      ) : (
                        <motion.img
                          key={index}
                          src={item.fields.Image.value?.src}
                          alt={index + 'MenuItem'}
                          // !h-auto
                          className={`aspect-[0.83] w-[250px] select-none object-cover`}
                          initial={{ height: marginPattern[index] }}
                          animate={{
                            height: marginPattern[index],
                          }}
                          exit={{ height: marginPattern[index] }}
                          transition={{
                            duration: 0.3,
                            ease: 'easeInOut',
                            type: 'spring',
                            stiffness: 50,
                          }}
                        />
                      )}
                    </AnimatePresence>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </FadeInUp>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default withDatasourceCheck()<CarouselBanner9Props>(Default);
