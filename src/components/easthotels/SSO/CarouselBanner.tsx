import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Image as JssImage, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import Typography from '../Typography/Typography';
import { CarouselBannerProps } from './types';
import { sendGTMEvent } from '@next/third-parties/google';
import { GetLocaleUrl } from '@/utilities/LanguageUtilities';
import { useI18n } from 'next-localization';

type CarouselProps = {
  slides: Array<CarouselBannerProps>;
};

const CarouselBanner: React.FC<CarouselProps> = ({ slides }) => {
  const { locale } = useI18n();
  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      spaceBetween={50}
      pagination={{ clickable: true }}
      loop={true}
      autoplay={{
        delay: 10000,
        disableOnInteraction: false,
      }}
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <div className="relative h-[370px] w-full">
            <JssImage field={slide.fields.Image} className="h-full w-full object-cover" priority />
          </div>
          <div className="absolute inset-0 flex flex-col items-start justify-center px-5 text-white">
            <p className="text-[40px] leading-[40px]">
              <Text field={slide.fields.Heading} />
              <br></br>
              <div className="font-[Bellefair]">
                <Text field={slide.fields.Title} />
              </div>
            </p>
            <Typography variant="l2" className="py-10  sm:max-w-[60%]">
              <Text field={slide.fields.Description} />
            </Typography>
            <a
              onClick={(event) => {
                event.preventDefault();
                sendGTMEvent({
                  event: 'offer_interact',
                  offer_title: slide?.fields?.OfferTitle,
                  intent: 'view offer details',
                });
                slide?.fields?.Link?.value?.href && slide.fields.Link.value?.target === '_blank'
                  ? window.open(GetLocaleUrl(slide?.fields?.Link?.value?.href, locale()))
                  : (window.location.href = GetLocaleUrl(
                      slide?.fields?.Link?.value?.href ?? '',
                      locale()
                    ));
              }}
              //href={slide.fields?.Link?.value?.href}
              //target={slide.fields.Link.value?.target}
            >
              <Typography variant="sso_track" underline fontWeight="bold" fontColor="white">
                <Text field={slide.fields.LinkText} />
              </Typography>
            </a>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CarouselBanner;
