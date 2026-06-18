import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import FadeInUp from '../Animation/FadeInUp';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation } from 'swiper/modules';
import { useState , JSX} from 'react';
import {
  LinkField,
  TextField,
  Image as ScImage,
  Text as ScText,
  withDatasourceCheck,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { AnimatePresence, motion } from 'framer-motion';
import CTAButton from '../Button/CTAButton';
import Typography from '../Typography/Typography';
import { NextArrow, PrevArrow } from '../CustomTypes/Components/Arrow';
import useArrow from '@/hooks/useArrow';
import { _PageMetadata } from '@/props/common/_PageMetadata';
import { PageRouteFields } from '@/props/Core/PageProps';
import { CarouselBanner10Props } from '@/props/Media/CarouselBannerProps';
import ComponentError from '../Error/ComponentError';

const Default = (carouselBanner10Props: CarouselBanner10Props): JSX.Element => {
  try {
    const context = useSitecoreContext();
    const { route } = context.sitecoreContext;
    const pageFields = route?.fields as PageRouteFields & _PageMetadata;

    const { arrowColor } = useArrow(
      pageFields.IsPropertyInnerPage.value,
      pageFields.IsBrandInnerPage.value
    );

    const sitecoreCss = carouselBanner10Props.params?.Styles ?? '';

    const [swiperIndex, setSwiperIndex] = useState(0);
    return (
      <div className={'lg:medium-section-container mx-[15px] ' + sitecoreCss}>
        {/* <FadeInUp> */}
        <div className="flex flex-col justify-center gap-[40px] pt-[20px] lg:flex-row">
          <div className="flex gap-[20px]">
            <div className="mr-[-15px]  overflow-hidden lg:mr-0">
              <Swiper
                slidesPerView={1}
                navigation={{
                  nextEl: '.carousel10-next-arrow',
                  prevEl: '.carousel10-prev-arrow',
                }}
                effect="coverflow"
                coverflowEffect={{
                  rotate: 0,
                  slideShadows: false,
                  scale: 1.5,
                  depth: 150,
                }}
                spaceBetween={150}
                modules={[Navigation, EffectCoverflow]}
                className="w-[calc(100vw*0.395)] lg:w-[330px] aspect-[148/212] lg:aspect-[330/495] relative"
                speed={600}
                onSlideChange={(swiper) => {
                  setSwiperIndex(swiper.realIndex);
                }}
                allowTouchMove={false}
                loop={true}
              >
                {carouselBanner10Props.fields.SelectedArticles &&
                  carouselBanner10Props.fields.SelectedArticles.map((swiper, index) => (
                    <SwiperSlide key={index}>
                      <ScImage field={swiper.fields.LeftImage} className="object-cover h-full" />
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
            <div className="order-first  mt-[50px] overflow-hidden lg:order-last ">
              <Swiper
                slidesPerView={1}
                navigation={{
                  nextEl: '.carousel10-next-arrow',
                  prevEl: '.carousel10-prev-arrow',
                }}
                spaceBetween={150}
                effect="coverflow"
                coverflowEffect={{
                  rotate: 0,
                  slideShadows: false,
                  scale: 1.5,
                  depth: 150,
                }}
                modules={[Navigation, EffectCoverflow]}
                className="w-[calc(100vw*0.525)] lg:w-[330px] aspect-[197/271] lg:aspect-[330/495] relative"
                speed={600}
                onSlideChange={(swiper) => {
                  setSwiperIndex(swiper.realIndex);
                }}
                allowTouchMove={false}
                loop={true}
              >
                {carouselBanner10Props.fields.SelectedArticles &&
                  carouselBanner10Props.fields.SelectedArticles.map((swiper, index) => (
                    <SwiperSlide key={index}>
                      <ScImage field={swiper.fields.RightImage} className="object-cover h-full" />
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
          </div>
          <div className="mx-[15px] lg:mx-0 lg:mt-[60px] lg:w-[440px]">
            <div className="flex gap-3 py-[20px] lg:py-[30px]">
              <PrevArrow className={`carousel10-prev-arrow ${arrowColor}`} imgClassName='max-w-[20px]' />
              <NextArrow className={`carousel10-next-arrow ${arrowColor}`} imgClassName='max-w-[20px]' />
            </div>
            {/* replace with BannerTextSectionContent.tsx after sitecore conversion */}
            <AnimatePresence mode="wait">
              {/* <motion.div
                initial={{ opacity: 0, translateY: 40 }}
                animate={{ opacity: 1, translateY: 0, transition: { duration: 0.1 } }}
                exit={{ opacity: 0, translateY: 40, transition: { duration: 0.1 } }}
                key={swiperIndex}
              > */}
              <Typography variant="inner-h1" font="Bellefair">
                <ScText
                  field={
                    carouselBanner10Props.fields.SelectedArticles[swiperIndex]?.fields.Title
                  }
                />
              </Typography>
              <div className="my-[30px] lg:mt-[80px]">
                <Typography variant="p">
                  <ScText
                    field={
                      carouselBanner10Props.fields.SelectedArticles[swiperIndex]?.fields
                        .Description
                    }
                  />
                </Typography>
              </div>
              <CTAButton
                url={
                  carouselBanner10Props.fields.SelectedArticles[swiperIndex]?.url as string
                }
                text={
                  carouselBanner10Props.fields.CTAText as TextField
                }
                variant="underlined"
              ></CTAButton>
              {/* </motion.div> */}
            </AnimatePresence>
          </div>
        </div>
        {/* </FadeInUp> */}
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />
  }


};

export default withDatasourceCheck()<CarouselBanner10Props>(Default);
