import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import React from 'react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import FadeInUp from '../Animation/FadeInUp';
import Typography from '../Typography/Typography';
import { PrevArrow, NextArrow } from '../CustomTypes/Components/Arrow';
import useArrow from '@/hooks/useArrow';
import {
  withDatasourceCheck,
  Text as ScText,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { TestimonialProps } from '@/props/PageContent/TestimonialProps';
import { _quote } from '@/props/common/_quote';
import { Treelist } from '@/props/fields/ScField';
import { _PageMetadata } from '@/props/common/_PageMetadata';
import { PageRouteFields } from '@/props/Core/PageProps';
import ComponentError from '../Error/ComponentError';

const TestimonialCard = ({ quote, isActive }: { quote: Treelist<_quote> }) => {
  try {
    return (
      <div
        className={`mx-[15px] flex flex-col items-center lg:mx-0 lg:text-center ${isActive ? '' : 'opacity-[0.3]'}`}
      >
        <FadeInUp>
          <Typography
            variant={'h1'}
            font="Bellefair"
            extraStyles="opacity-[0.3] !text-[100px] !leading-[85px]"
          >
            “
          </Typography>
          <Typography variant={'p'} font={'Amiko'} extraStyles="mb-[30px]">
            <ScText field={quote.fields.Quote} />
          </Typography>
          <Typography variant="l1" font="Amiko" fontWeight="bold">
            <ScText field={quote.fields.PersonName} />
          </Typography>
          <Typography variant="l1" font="Amiko">
            <ScText field={quote.fields.PersonJobTitle} />
          </Typography>
        </FadeInUp>
      </div>
    )
  } catch (err) {
    return <ComponentError error={err} />
  }
};

const Default = (testimonialProps: TestimonialProps) => {
  try {
    const sitecoreCss = '';
    const context = useSitecoreContext();
    const { route } = context.sitecoreContext;
    const pageFields = route?.fields as PageRouteFields & _PageMetadata;

    const { arrowColor } = useArrow(
      pageFields.IsPropertyInnerPage.value,
      pageFields.IsBrandInnerPage.value
    );

    //   const sitecoreCss = componentProps.params?.Styles ?? ''; use this after component converted
    return (
      <div className={'medium-section-container' + sitecoreCss}>
        <div className="lg:hidden">
          <Swiper
            navigation={{
              nextEl: '.mobile-testimonial-next-arrow',
              prevEl: '.mobile-testimonial-prev-arrow',
            }}
            modules={[Navigation]}
            slidesPerView={1}
            spaceBetween={40}
            centeredSlides={true}
          >
            {testimonialProps.fields.SelectedArticles.map((quote: Treelist<_quote>, index) => (
              <SwiperSlide key={index}>
                {({ isActive }) => <TestimonialCard quote={quote} isActive={isActive} />}
              </SwiperSlide>
            ))}
            <div className="flex justify-center gap-[10px]">
              <PrevArrow className={`mobile-testimonial-prev-arrow  ${arrowColor}`} />
              <NextArrow className={`mobile-testimonial-next-arrow  ${arrowColor}`} />
            </div>
          </Swiper>
        </div>
        <div className="hidden lg:block">
          <Swiper
            navigation={{
              nextEl: '.testimonial-next-arrow',
              prevEl: '.testimonial-prev-arrow',
            }}
            modules={[Navigation]}
            slidesPerView={2.2}
            spaceBetween={120}
            centeredSlides={true}
          >
            {testimonialProps.fields.SelectedArticles.map((quote: Treelist<_quote>, index) => (
              <SwiperSlide key={index}>
                {({ isActive }) => <TestimonialCard quote={quote} isActive={isActive} />}
              </SwiperSlide>
            ))}
            <PrevArrow
              className={`testimonial-prev-arrow absolute top-[50%] lg:left-[25%] ${arrowColor}`}
            />
            <NextArrow
              className={`testimonial-next-arrow  absolute top-[50%] lg:right-[25%] ${arrowColor}`}
            />
          </Swiper>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />
  }
};

export default withDatasourceCheck()<TestimonialProps>(Default);
