import React, { useRef, useState, JSX } from 'react';
import { EffectFade, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import Typography from 'components/easthotels/Typography/Typography';
import FadeInUp from 'components/easthotels/Animation/FadeInUp';
import {
  withDatasourceCheck,
  Image as ScImage,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { Gallery1Props } from '@/props/media/Gallery1Props';
import { NextArrow, PrevArrow } from '../CustomTypes/Components/Arrow';
import useArrow from '@/hooks/useArrow';
import { _PageMetadata } from '@/props/common/_PageMetadata';
import { PageRouteFields } from '@/props/Core/PageProps';
import ComponentError from '../Error/ComponentError';
import Image from 'next/image';

const publicUrl = getPublicUrl();

const Default = (gallery1Props: Gallery1Props): JSX.Element => {
  try {
    const gallerySwiperRef = useRef<SwiperInstance>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const slideNext = () => {
      if (gallerySwiperRef.current && gallerySwiperRef.current.swiper) {
        gallerySwiperRef.current.swiper.slideNext();
      }
    };

    const slidePrev = () => {
      if (gallerySwiperRef.current && gallerySwiperRef.current.swiper) {
        gallerySwiperRef.current.swiper.slidePrev();
      }
    };

    const handleSlideChange = (swiper: SwiperInstance) => {
      setCurrentIndex(swiper.realIndex);
    };
    const sitecoreCss = gallery1Props.params?.Styles ?? '';
    const context = useSitecoreContext();
    const { route } = context.sitecoreContext;
    const pageFields = route?.fields as PageRouteFields & _PageMetadata;

    const { arrowColor } = useArrow(
      pageFields.IsPropertyInnerPage.value,
      pageFields.IsBrandInnerPage.value
    );

    return (
      <FadeInUp>
        <div
          className={
            'medium-section-container flex flex-col items-center gap-[10px] ' + sitecoreCss
          }
        >
          <div className="flex flex-col items-center justify-between gap-[10px] lg:flex-row">
            <div className="hidden lg:block">
              <PrevArrow className={`gallery-prev-arrow ${arrowColor}`} onClick={slidePrev} />
            </div>
            <div className="max-w-[800px] overflow-hidden">
              <Swiper
                ref={gallerySwiperRef}
                slidesPerView={1}
                spaceBetween={0}
                modules={[EffectFade, Navigation]}
                loop
                className="gallery h-full"
                onSlideChange={handleSlideChange}
                onSwiper={(swiper) => {
                  handleSlideChange(swiper);
                }}
              >
                {gallery1Props.fields.Images?.map((src, index) => (
                  <SwiperSlide key={index}>
                    <div className="swiper-slide-content">
                      <ScImage field={src.fields.Image} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="hidden lg:block">
              <NextArrow className={`gallery-next-arrow ${arrowColor}`} onClick={slideNext} />
            </div>

            <div className="mt-3 flex items-center gap-3 lg:hidden">
              <PrevArrow className={`gallery-prev-arrow ${arrowColor}`} onClick={slidePrev} />
              <Typography variant={'p'}>{`${(currentIndex + 1)
                .toString()
                .padStart(
                  2,
                  '0'
                )} / ${gallery1Props.fields.Images.length.toString().padStart(2, '0')}`}</Typography>
              <div className="gallery-next-arrow bg-green-primary" onClick={slideNext}>
                <Image
                  src={`${publicUrl}/icon_arrow_right.svg`}
                  alt="right_arrow"
                  width={20}
                  height={20}
                />
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <Typography variant={'p'} extraStyles="mt-[20px]">{`${(currentIndex + 1)
              .toString()
              .padStart(
                2,
                '0'
              )} / ${gallery1Props.fields.Images.length.toString().padStart(2, '0')}`}</Typography>
          </div>
        </div>
      </FadeInUp>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default withDatasourceCheck()<Gallery1Props>(Default);
