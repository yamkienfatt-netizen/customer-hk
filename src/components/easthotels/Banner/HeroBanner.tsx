import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { _Image } from '@/props/common/_Image';
import { _MultiMediaBanner } from '@/props/common/_MultiMediaBanner';
import { Image as ScImage, Placeholder as ScPlaceholder } from '@sitecore-jss/sitecore-jss-nextjs';
import { Treelist } from '@/props/fields/ScField';
import ComponentError from '../Error/ComponentError';
import useWindowSize from '@/hooks/useWindowSize';

const SwiperContent = ({ banner }: { banner: Treelist<_MultiMediaBanner> }) => {
  try {
    const isVideo = banner.fields.Image?.value?.src == undefined;

    return isVideo ? (
      <video autoPlay loop muted className="h-full w-full object-cover">
        <source src={banner.fields.Video.value.href} type="video/mp4" />
      </video>
    ) : (
      <div
        //!max-[375px]!:h-[88%] !h-[72%]
        className="swiper-slide h-full"
      >
        {/* <img
          src={banner.fields.Image?.value?.src?.toString()}
          alt="Background"
        /> */}
        <ScImage
          field={banner.fields.Image}
          className="h-full w-full object-cover object-[75%_50%] lg:object-center"
          srcSet={[{ mw: 1920 }]}
          sizes="1920px"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#000000a3] to-transparent"></div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

const HeroBanner = ({
  banners,
  onActiveIndexChange,
}: {
  banners: Treelist<_MultiMediaBanner>[];
  onActiveIndexChange: (realIndex: number) => void;
}) => {
  try {
    const { height: windowInnderHeight } = useWindowSize().windowSize;
    const { isMobile } = useWindowSize();

    return (
      //absolute
      <div
        className="herobanner-section-container hero-carousel h-full"
        style={{
          height: isMobile ? windowInnderHeight && windowInnderHeight * 0.75 : '100%',
        }}
      >
        <div className="hidden lg:block">
          <div className="swiper-pagination-header" />
        </div>
        <Swiper
          // direction={'vertical'} //setting to vertical makes it unable to scroll down using mobile
          spaceBetween={0}
          effect={'fade'}
          slidesPerView={1}
          allowTouchMove={false}
          modules={[EffectFade, Autoplay, Pagination]}
          pagination={{ el: '.swiper-pagination-header', clickable: true }}
          autoplay={{
            delay: 5000,
            pauseOnMouseEnter: true,
            disableOnInteraction: false,
          }}
          loop
          onActiveIndexChange={({ realIndex }) => {
            onActiveIndexChange(realIndex);
          }}
          className="heroBanner relative h-full"
        >
          {banners?.map((banner: Treelist<_MultiMediaBanner>, index) => (
            <SwiperSlide key={index}>
              <SwiperContent banner={banner}></SwiperContent>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default HeroBanner;
