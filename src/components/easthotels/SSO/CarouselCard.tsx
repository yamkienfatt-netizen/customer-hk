import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Image as JssImage, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import 'swiper/css';
import 'swiper/css/navigation';
import { CardProps } from './types';
import Typography from '../Typography/Typography';
import { sendGTMEvent } from '@next/third-parties/google';
import { GetLocaleUrl } from '@/utilities/LanguageUtilities';
import { useI18n } from 'next-localization';

type CarouselProps = {
  slides: Array<CardProps>;
};

const CarouselCard: React.FC<CarouselProps> = ({ slides }) => {
  const { locale } = useI18n();
  const clickLink = (id: string) => {
    const aTaget = document.querySelector('a[id="' + id + '"]') as HTMLLinkElement;
    sendGTMEvent({
      event: 'offer_interact',
      offer_title: aTaget.getAttribute('gtm-data'),
      intent: 'discover hotel offer',
    });
    aTaget.click();
  };
  return (
    <div className="SSO-swiper ">
      <Swiper
        modules={[Navigation]}
        navigation
        breakpoints={{
          640: { slidesPerView: 3.2, spaceBetween: 30 },
          0: { slidesPerView: 1.5, spaceBetween: 30 },
        }}
        //loop={true}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <JssImage
              field={slide.fields.Image}
              className="w-full cursor-pointer"
              priority
              onClick={slide.click ? slide.click : () => clickLink(slide.id)}
            />
            {/* object-fit: cover; */}

            <Typography variant="sso_title1" fontWeight="semiBold" className="my-5 cursor-pointer">
              <Text
                field={slide.fields.Title}
                onClick={slide.click ? slide.click : () => clickLink(slide.id)}
              />
            </Typography>

            <a
              id={slide.id}
              href={
                slide.fields.Link.value?.href
                  ? GetLocaleUrl(slide.fields.Link.value.href, locale())
                  : '#'
              }
              target={slide.fields.Link.value?.target}
              gtm-data={slide.hotel}
            >
              <Typography variant="sso_track" fontWeight="bold" underline fontColor="black">
                <Text field={slide.fields.LinkText} />
              </Typography>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CarouselCard;
