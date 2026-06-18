import React, { useMemo, useRef } from 'react';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { GalleryLightbox } from '../Gallery/GalleryLightbox';
import useWindowSize from '@/hooks/useWindowSize';
import { _Image } from '@/props/common/_Image';
import { Treelist } from '@/props/fields/ScField';
import {
  withDatasourceCheck,
  Text as ScText,
  Image as ScImage,
  TextField,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { NextArrow, PrevArrow } from '../CustomTypes/Components/Arrow';
import ComponentError from '../Error/ComponentError';
import Image from 'next/image';

const publicUrl = getPublicUrl();

const RoomSwiper = ({
  data,
  swiperArrowColor,
  roomTemplateNum,
}: {
  data: Treelist<_Image>[];
  swiperArrowColor: string;
  roomTemplateNum: string;
}) => {
  try {
    const { isMobile } = useWindowSize();

    const imgRef = useRef<SwiperRef>(null);
    const imgContainerW = useMemo(() => {
      return imgRef.current?.swiper.width || 247.5;
    }, [imgRef.current?.swiper.width]);

    return (
      <>
        <Swiper
          // slidesPerView={isMobile ? 1 : 'auto'}
          slidesPerView={1}
          spaceBetween={0}
          navigation={{
            nextEl: `.room-next-arrow${roomTemplateNum}`,
            prevEl: `.room-prev-arrow${roomTemplateNum}`,
          }}
          centeredSlides={true}
          pagination={{
            el: `.room-pagination${roomTemplateNum}`,
            type: 'fraction',
            horizontalClass: 'carousel6-fraction-pagination',
          }}
          modules={[Pagination, Navigation]}
          className="carousel4 aspect-square w-full lg:aspect-[1.77]"
          ref={imgRef}
        >
          {data?.map((item, index) => {
            // console.log('item.fields.Image', item.fields.Image);
            return (
              <SwiperSlide key={index} className="h-full w-full hover:cursor-pointer">
                {/* style={{ width: imgContainerW }} */}

                <div className="relative lg:hidden">
                  <GalleryLightbox galleryItems={data} selectedItem={item}>
                    <ScImage
                      field={item.fields.Image}
                      className={`aspect-square h-full w-full object-cover`}
                    />
                  </GalleryLightbox>
                </div>

                <div className="hidden h-full w-full lg:block">
                  <ScImage
                    field={item.fields.Image}
                    //lg:max-w-[580px]
                    className="h-full w-full object-cover"
                  />
                </div>
              </SwiperSlide>
            );
          })}
          <div className="pointer-events-none absolute bottom-[10px] right-[10px] z-10 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-green-primary lg:hidden">
            <Image
              src={`/zoom_in_white.png`}
              alt="zoom_in"
              className="h-[15px] w-[15px]"
              width={15}
              height={15}
            />
          </div>
        </Swiper>

        <div className="mt-[10px] hidden select-none items-center justify-between lg:flex">
          <div className={`room-pagination${roomTemplateNum} pl-[5px]`}></div>
          <div className="gap-[10px] lg:flex">
            <PrevArrow
              className={`room-prev-arrow room-prev-arrow${roomTemplateNum} flex h-[35px] w-[35px] justify-center rounded-full  ${swiperArrowColor}`}
              imgClassName="w-[18px]"
            />
            <NextArrow
              className={`room-next-arrow room-next-arrow${roomTemplateNum} flex h-[35px] w-[35px] justify-center rounded-full  ${swiperArrowColor}`}
              imgClassName="w-[18px]"
            />
          </div>
        </div>
      </>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default RoomSwiper;
