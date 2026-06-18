import FadeInUp from 'components/easthotels/Animation/FadeInUp';
import HeaderSection from 'components/easthotels/Navigation/HeaderSection';
import Typography from 'components/easthotels/Typography/Typography';
import { useScroll } from 'framer-motion';
import { useEffect, useRef, useState,JSX } from 'react';
import { Pagination, Thumbs, FreeMode, Controller } from 'swiper/modules';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import CTAButton from 'components/easthotels/Button/CTAButton';
import {
  TextField,
  Text as ScText,
  Image as ScImage,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { SitecoreLink } from '../CustomTypes/Components/SitecoreLink';
import BannerTextSection from 'components/easthotels/Banner/BannerTextSection';
import { CarouselBanner2Props } from '@/props/Media/CarouselBannerProps';
import ComponentError from '../Error/ComponentError';
import useWindowSize from '@/hooks/useWindowSize';

export const Default = (carouselBanner2Props: CarouselBanner2Props): JSX.Element => {
  try {
    // for the swiper slide on the right
    //const SwiperDataModified = [...SwiperData.slice(1), SwiperData[0]];
    const SwiperData = carouselBanner2Props.fields.SelectedOffers;
    const SwiperDataModified = [...SwiperData.slice(1), SwiperData[0]];

    const target = useRef(null);
    const { scrollYProgress } = useScroll({
      target: target,
      offset: ['start end', 'end end'],
    });
    const { isMobile } = useWindowSize();

    const [swiper, setSwiper] = useState<SwiperClass | null | undefined>(null);
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null | undefined>(null);
    const [thumbsSwiper2, setThumbsSwiper2] = useState<SwiperClass | null | undefined>(null);

    const moveThumbsToSlide = (index) => {
      if (thumbsSwiper && thumbsSwiper.slideTo) {
        thumbsSwiper.slideTo(index);
      }
      if (thumbsSwiper2 && thumbsSwiper2.slideTo) {
        thumbsSwiper2.slideTo(index);
      }
    };
    const sitecoreCss = carouselBanner2Props.params?.Styles ?? '';


    useEffect(() => {
      if (swiper?.controller && thumbsSwiper?.controller && thumbsSwiper2?.controller) {
        swiper.controller.control = thumbsSwiper;
        thumbsSwiper.controller.control = swiper;
        thumbsSwiper2.controller.control = swiper;
      }
    }, [swiper, thumbsSwiper, thumbsSwiper2]);

    return (
      <div className="mx-[15px] lg:mx-auto">
        <div className={`small-section-container ${sitecoreCss}`}>
          <div className="pb-[70px] lg:flex lg:flex-col lg:items-center  lg:text-center ">
            <FadeInUp>
              <HeaderSection
                heading1={carouselBanner2Props.fields.Heading1}
                heading2={carouselBanner2Props.fields.Heading2}
              />
              <BannerTextSection {...carouselBanner2Props.fields} isDescriptionRichText={true} />
            </FadeInUp>
          </div>
          <div className="flex flex-col gap-[20px] lg:flex-row lg:gap-[50px]">
            <div className="grid grid-cols-5 gap-[30px]">
              <div className="col-span-4 lg:col-span-1">
                <Swiper
                  slidesPerView={1}
                  onSwiper={setSwiper}
                  onSlideChange={(swiper) => moveThumbsToSlide(swiper.realIndex)}
                  modules={[Pagination, Controller]}
                  controller={{ control: swiper }}
                  watchSlidesProgress={true}
                  className="h-[100%]"
                  speed={600}
                  allowTouchMove={true}
                  slidesOffsetAfter={1}
                >
                  {/* Fail-safe indicator in case swiper data is empty */}
                  {SwiperData.length > 0 &&
                    SwiperDataModified &&
                    SwiperDataModified.map((swiper, index) => (
                      <SwiperSlide key={index}>
                        <ScImage
                          field={swiper.fields.Image}
                          className="h-[235px] w-full max-w-none object-cover lg:h-[398px] "
                        />
                      </SwiperSlide>
                    ))}
                </Swiper>
              </div>
              <div className="col-span-1 lg:col-span-4">
                <Swiper
                  slidesPerView={1}
                  onSwiper={setThumbsSwiper}
                  onSlideChange={(swiper) => moveThumbsToSlide(swiper.realIndex)}
                  modules={[Pagination, Controller]}
                  controller={{ control: swiper }}
                  watchSlidesProgress={false}
                  className="carousel2-thumbs h-[100%]"
                  speed={600}
                  allowTouchMove={true}
                  slidesOffsetAfter={1}
                >
                  {SwiperData &&
                    SwiperData.map((swiper, index) => (
                      <SwiperSlide key={index}>
                        {/* <img src={swiper.image.src} alt={`IMG`} className="max-w-none h-[100%]" /> */}
                        <ScImage
                          field={swiper.fields.Image}
                          className="h-[235px] w-full max-w-none object-cover lg:h-[398px]"
                        />
                      </SwiperSlide>
                    ))}
                </Swiper>
              </div>
            </div>
            <div className="max-w-[540px] overflow-hidden lg:pt-[50px]">
              <Swiper
                slidesPerView={1}
                modules={[FreeMode, Pagination, Controller]}
                onSwiper={setThumbsSwiper2}
                onSlideChange={(swiper) => moveThumbsToSlide(swiper.realIndex)}
                // thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                pagination={{ el: '.swiper-pagination', clickable: true }}
                className="carousel2 carousel2-pagination h-[100%]"
                speed={600}
                allowTouchMove={true}
              >
                <div className="swiper-pagination"></div>
                {SwiperData &&
                  SwiperData.map((swiper, index) => (
                    <SwiperSlide key={index}>
                      <div className=" pt-[30px] lg:pt-[60px]">
                        <SitecoreLink field={swiper.fields.URL}>
                          <Typography variant="h4">
                            <ScText field={swiper.fields.Title} />
                          </Typography>
                          <div className="py-[30px]">
                            <Typography variant="p">
                              <ScText field={swiper.fields.Description} />
                            </Typography>
                          </div>
                        </SitecoreLink>
                        <CTAButton
                          text={swiper.fields.Text as TextField}
                          url={swiper.fields.URL as LinkField}
                          variant="underlined"
                        ></CTAButton>
                      </div>
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};
