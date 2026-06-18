import React, { useState, JSX } from 'react';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import Typography from 'components/easthotels/Typography/Typography';
import { Pagination, Thumbs, FreeMode, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { PrevArrow, NextArrow } from '../CustomTypes/Components/Arrow';
import FadeInUp from '../Animation/FadeInUp';
import useArrow from '@/hooks/useArrow';
import {
  useSitecoreContext,
  withDatasourceCheck,
  Text as ScText,
  RichText as ScRichText,
  Image as ScImage,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { PageRouteFields } from '@/props/Core/PageProps';
import { _PageMetadata } from '@/props/common/_PageMetadata';
import ComponentError from '../Error/ComponentError';
import { CarouselBannerProps } from '@/props/Media/CarouselBannerProps';

const Default = (carouselBannerProps: CarouselBannerProps): JSX.Element => {
  try {
    const context = useSitecoreContext();
    const { route } = context.sitecoreContext;
    const pageFields = route?.fields as PageRouteFields & _PageMetadata;

    const [thumbsSwiper, setThumbsSwiper] = useState(0);
    const [swiperIndex, setSwiperIndex] = useState(0);
    const moveThumbsToSlide = (index) => {
      if (thumbsSwiper && thumbsSwiper.slideTo) {
        thumbsSwiper.slideTo(index);
        setSwiperIndex(index);
        console.log(index);
      }
    };
    // sitecore flags
    const ImageOnRight = true;
    const gridClass = ImageOnRight ? 'lg:order-last' : 'lg:order-first';

    const { arrowColor } = useArrow(
      pageFields.IsPropertyInnerPage.value,
      pageFields.IsBrandInnerPage.value
    );

    const sitecoreCss = carouselBannerProps.params?.Styles ?? ''; // uncomment after convert

    return (
      <FadeInUp>
        <div className="mx-[15px] lg:mx-[50px]">
          <div
            className={
              'medium-section-container lg:mx-auto lg:grid lg:!max-w-[1440px] lg:grid-cols-2 lg:justify-center lg:gap-[40px]' +
              sitecoreCss
            }
          >
            <div className={`hidden pb-[40px] lg:block`}>
              <div className="hidden pt-[40px] lg:block">
                <Typography variant="h2" font="Bellefair">
                  <ScText field={carouselBannerProps.fields.Title} />
                </Typography>
              </div>
              <Swiper
                slidesPerView={1}
                modules={[FreeMode, Pagination, Thumbs, Navigation]}
                onSlideChange={(swiper) => moveThumbsToSlide(swiper.realIndex)}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                pagination={{ el: '.swiper-pagination', clickable: true }}
                navigation={{
                  nextEl: '.carousel11-next-arrow',
                  prevEl: '.carousel11-prev-arrow',
                }}
                className="carousel2 carousel11 relative h-[100%] lg:mt-[60px]"
                speed={600}
                allowTouchMove={false}
              >
                <div className="absolute top-0 flex w-full justify-between">
                  <div className="swiper-pagination"></div>
                  <div className="flex gap-3 lg:hidden">
                    <PrevArrow
                      className={`carousel11-prev-arrow ${arrowColor}`}
                      imgClassName="max-w-[20px]"
                    />
                    <NextArrow
                      className={`carousel11-next-arrow ${arrowColor}`}
                      imgClassName="max-w-[20px]"
                    />
                  </div>
                </div>
                {carouselBannerProps.fields.SelectedArticles &&
                  carouselBannerProps.fields.SelectedArticles.map((swiper, index) => (
                    <SwiperSlide key={index}>
                      <div className="my-[30px] mt-[50px]">
                        <Typography variant="h4">
                          <ScText field={swiper.fields.Title} />
                        </Typography>
                      </div>
                      <Typography variant="p">
                        <ScRichText field={swiper.fields.Content} />
                      </Typography>
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
            <div className={`${gridClass} order-first overflow-hidden lg:mx-0 xl:mx-0`}>
              <div className="mb-[30px] lg:hidden">
                <Typography variant="h2" font="Bellefair">
                  <ScText field={carouselBannerProps.fields.Title} />
                </Typography>
              </div>
              <Swiper
                slidesPerView={1}
                spaceBetween={0}
                onSwiper={setThumbsSwiper}
                onSlideChange={(swiper) => moveThumbsToSlide(swiper.realIndex)}
                modules={[Pagination, Thumbs]}
                watchSlidesProgress={true}
                className="carousel2-thumbs h-[100%]"
                speed={600}
                allowTouchMove={false}
              >
                {carouselBannerProps.fields.SelectedArticles &&
                  carouselBannerProps.fields.SelectedArticles.map((swiper, index) => (
                    <SwiperSlide key={index}>
                      <ScImage field={swiper.fields.Image} className={'h-full object-fill'} />
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>

            <div className="lg:hidden">
              <Swiper
                slidesPerView={1}
                modules={[FreeMode, Pagination, Thumbs, Navigation]}
                onSlideChange={(swiper) => moveThumbsToSlide(swiper.realIndex)}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                pagination={{ el: '.swiper-pagination', clickable: true }}
                navigation={{
                  nextEl: '.carousel11-next-arrow',
                  prevEl: '.carousel11-prev-arrow',
                }}
                className="carousel2 carousel11 relative h-[100%] lg:mt-[60px] lg:max-w-[590px]"
                speed={600}
                allowTouchMove={false}
              >
                <div className="absolute top-0 flex w-full justify-between">
                  <div className="swiper-pagination"></div>
                  <div className="flex gap-3 lg:hidden">
                    <PrevArrow
                      className={`carousel11-prev-arrow ${arrowColor} mt-[10px]`}
                      imgClassName="max-w-[20px]"
                    />
                    <NextArrow
                      className={`carousel11-next-arrow ${arrowColor} mt-[10px]`}
                      imgClassName="max-w-[20px]"
                    />
                  </div>
                </div>
                {carouselBannerProps.fields.SelectedArticles &&
                  carouselBannerProps.fields.SelectedArticles.map((swiper, index) => (
                    <SwiperSlide key={index}>
                      <div className="my-[30px] mt-[50px]">
                        <Typography variant="h4">
                          <ScText field={swiper.fields.Title} />
                        </Typography>
                      </div>
                      <Typography variant="p">
                        <ScRichText field={swiper.fields.Content} />
                      </Typography>
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
          </div>
        </div>
      </FadeInUp>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default withDatasourceCheck()<CarouselBannerProps>(Default);
