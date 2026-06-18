import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import Typography from '../Typography/Typography';
import { GalleryItemType } from '../Gallery/GalleryLightbox';
import { NextArrow, PrevArrow } from '../CustomTypes/Components/Arrow';
import useArrow from '@/hooks/useArrow';
import ComponentError from '../Error/ComponentError';

const publicUrl = getPublicUrl();

interface CarouselBanner8Prop {
  height: number;
  imgHeight: number;
  imgWidth: number;
  imgClassName: string;
  paginationHeight: number;
  captionHeight: number;
  galleryItems: GalleryItemType[];
  selectedId: string;
  IsPropertyInnerPage: boolean;
  IsBrandInnerPage: boolean;
}

const CarouselBanner8 = ({
  height,
  imgHeight,
  imgWidth,
  imgClassName,
  paginationHeight,
  captionHeight,
  galleryItems,
  selectedId,
  IsPropertyInnerPage,
  IsBrandInnerPage,
}: CarouselBanner8Prop) => {
  try {
    const [activeIndex, setActiveIndex] = useState(0);
    const [caption, setCaption] = useState('');
    const formatPaginationNumber = (number: number) => {
      if (number.toString().length < 2) {
        return '0' + number;
      } else {
        return number;
      }
    };

    useEffect(() => {
      const selectedItemIndex = getSelectedItemIndex();
      setActiveIndex(selectedItemIndex);
      getCaption(selectedItemIndex);
    }, []);

    const getSelectedItemIndex = () => {
      const selectedItemIndex = galleryItems.findIndex((item) => item.id == selectedId);
      return selectedItemIndex;
    };

    const getCaption = (realIndex: number) => {
      const activeItem = galleryItems.find((item, index) => {
        return index == realIndex;
      });
      activeItem && setCaption(activeItem?.fields?.Caption?.value || activeItem?.displayName);
    };

    const { arrowColor } = useArrow(IsPropertyInnerPage, IsBrandInnerPage);
    return (
      <div className="relative flex h-full max-w-[1280px] justify-center">
        <div className="flex flex-col">
          <div className="absolute hidden h-full w-full lg:flex lg:items-center">
            <PrevArrow
              className={`carousel8-prev-arrow absolute left-[30px] flex h-[50px] w-[50px] items-center rounded-full ${arrowColor} z-10`}
              imgClassName={'lg:w-[25px]'}
            />
            <NextArrow
              className={`carousel8-next-arrow absolute right-[30px] flex h-[50px] w-[50px] items-center rounded-full ${arrowColor} z-10`}
              imgClassName={'lg:w-[25px]'}
            />
          </div>

          <div className="flex w-full items-center justify-center">
            <div className="flex items-center">
              <div className="carousel8-prev-arrow mr-[10px] h-[30px] w-[30px] rotate-180 lg:hidden">
                <img
                  src={`${publicUrl}/icon_arrow_right_black.svg`}
                  alt="left_arrow"
                  className="w-[20px]"
                />
              </div>
              <div
                className="carousel8-pagination flex items-center justify-center"
                style={{ height: paginationHeight }}
              ></div>
              <div className="carousel8-next-arrow ml-[10px] h-[30px] w-[30px] lg:hidden">
                <img
                  src={`${publicUrl}/icon_arrow_right_black.svg`}
                  alt="right_arrow"
                  className="w-[20px]"
                />
              </div>
            </div>
          </div>

          <Swiper
            slidesPerView={'auto'}
            spaceBetween={20}
            speed={1000}
            initialSlide={getSelectedItemIndex()}
            onActiveIndexChange={({ realIndex }) => {
              getCaption(realIndex);
              setActiveIndex(realIndex);
            }}
            navigation={{
              nextEl: '.carousel8-next-arrow',
              prevEl: '.carousel8-prev-arrow',
            }}
            centeredSlides={true}
            pagination={{
              el: '.carousel8-pagination',
              type: 'fraction',
              formatFractionCurrent: (number) => {
                return formatPaginationNumber(number);
              },
              formatFractionTotal: (number) => {
                return formatPaginationNumber(number);
              },
              renderFraction: (currentClass, totalClass) => {
                return (
                  '<span class="' +
                  currentClass +
                  '"></span>' +
                  '<span style="margin: 0 3px;"></span>' +
                  '/' +
                  '<span style="margin: 0 3px;"></span>' +
                  '<span class="' +
                  totalClass +
                  '"></span>'
                );
              },
              horizontalClass: 'carousel6-fraction-pagination',
            }}
            modules={[Pagination, Navigation]}
            className="carousel4 h-[100%]"
          >
            {galleryItems.map((banner, index) => {
              return (
                <SwiperSlide key={index}>
                  {({ isActive }) => (
                    <motion.div className="flex h-full items-center">
                      <motion.img
                        src={banner?.fields?.Image?.value?.src}
                        alt="IMG"
                        animate={{
                          scale: isActive ? 1 : 0.6,
                        }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                        className={imgClassName}
                        style={{
                          height: imgHeight,
                          width: imgWidth,
                        }}
                      />
                    </motion.div>
                  )}
                </SwiperSlide>
              );
            })}
          </Swiper>

          <div style={{ height: captionHeight }} className="pt-[10px]">
            <Typography variant="l1" fontWeight="bold" extraStyles="text-center">
              {caption}
            </Typography>
          </div>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default CarouselBanner8;
