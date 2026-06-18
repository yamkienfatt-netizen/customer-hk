import React, { useEffect, useState, JSX } from 'react';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import CTAButton from 'components/easthotels/Button/CTAButton';
import Typography from 'components/easthotels/Typography/Typography';
import { Pagination, FreeMode, Controller, Autoplay } from 'swiper/modules';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import { AnimatePresence, motion } from 'framer-motion';
import { StayAtEastBannerSticky } from '../StayAtEast/StayAtEastBannerSticky';
import {
  TextField,
  withDatasourceCheck,
  Text as ScText,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { _StayDetail } from '@/props/common/_StayDetail';
import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import { useWindowSize } from '@uidotdev/usehooks';
import { CarouselBanner5Props } from '@/props/Media/CarouselBannerProps';
import ComponentError from '../Error/ComponentError';
import { useUrlForBookingRooms } from '@/hooks/useUrlForBookingRooms';
import BookNow from 'components/easthotels/StayAtEast/BookNow';
import { cn } from 'lib/utils';
import Image from 'next/image';

const publicUrl = getPublicUrl();

const RoomTitleSlider: React.FC = ({
  roomTitle,
  url,
  index,
  className,
}: {
  roomTitle: TextField | undefined;
  url: string;
  index: number;
  className?: string;
}) => {
  try {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          exit={{
            opacity: 0,
            clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
            transition: { duration: 0.3 },
          }}
          initial={{ opacity: 0, clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
          animate={{
            opacity: 1,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            transition: { duration: 0.3 },
          }}
          className={cn('my-[20px] lg:mb-[60px]', className)}
          key={index}
        >
          <a href={url}>
            <Typography variant="inner-h1" font="Bellefair">
              <ScText field={roomTitle} />
            </Typography>
          </a>
        </motion.div>
      </AnimatePresence>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

const SwiperSlideTextContent: React.FC<
  _StayDetail & {
    Title: TextField;
    Description: TextField;
    RoomSize: TextField;
    Capacity: TextField;
    CtaText: TextField;
    Url: string;
  }
> = ({ Title, Description, RoomSize, Capacity, CtaText, Url }) => {
  try {
    const { t } = useI18n();

    return (
      <>
        <RoomTitleSlider roomTitle={Title} url={Url} index={0} className="mt-4 block lg:hidden" />
        <div className="flex flex-row gap-[40px]">
          <div>
            <div className="flex gap-[5px]">
              <Image
                src={`${publicUrl}/icon_room_size.svg`}
                alt="room icon"
                width={12}
                height={18}
                className="mt-[-2%]"
              />
              <Typography variant="l2" fontWeight="bold">
                {t(DICTIONARY_CONSTANT.STAYS.ROOM_SIZE)}
              </Typography>
            </div>
            <Typography variant="l1">
              <ScText field={RoomSize} />
            </Typography>
          </div>
          <div>
            <div className="flex gap-[5px]">
              <Image
                src={`${publicUrl}/icon_capacity.svg`}
                alt="room icon"
                width={12}
                height={18}
                className="mt-[-2%]"
              />
              <Typography variant="l2" fontWeight="bold">
                {t(DICTIONARY_CONSTANT.STAYS.CAPACITY)}
              </Typography>
            </div>
            <Typography variant="l1">
              <ScText field={Capacity} />
            </Typography>
          </div>
        </div>
        <div className="my-[30px] hidden lg:block">
          <Typography variant="p">
            <ScText field={Description} />
          </Typography>
        </div>
        <CTAButton
          text={CtaText as TextField}
          url={Url}
          variant="underlined"
          extraContainerStyles="mt-[30px]"
        />
      </>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

const Default = (carouselBanner5Props: CarouselBanner5Props): JSX.Element => {
  try {
    const [swiper, setSwiper] = useState<SwiperClass | null | undefined>(null);
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null | undefined>(null);
    const [swiperIndex, setSwiperIndex] = useState(0);
    const moveThumbsToSlide = (index: number) => {
      if (thumbsSwiper) {
        // if (thumbsSwiper && thumbsSwiper.slideTo) {
        // thumbsSwiper.slideTo(index);
        setSwiperIndex(index);
        // console.log('swiper', index);
      }
    };
    const sitecoreCss = carouselBanner5Props.params?.Styles ?? '';
    const { width } = useWindowSize();
    const spaceBetween = width && width < 992 ? -50 : -100;

    const { t } = useI18n();

    const { url } = useUrlForBookingRooms({
      selectedHotelId:
        carouselBanner5Props?.fields?.PropertySiteConfiguration?.fields
          ?.PropertyBookNowConfiguration?.fields?.HotelId?.value,
    });

    useEffect(() => {
      if (swiper?.controller && thumbsSwiper?.controller) {
        swiper.controller.control = thumbsSwiper;
        thumbsSwiper.controller.control = swiper;
      }
    }, [swiper, thumbsSwiper]);

    return (
      <div className={'small-section-container !max-w-none lg:!max-w-[1280px] ' + sitecoreCss}>
        <div
          //md:max-w-[768px]
          className="pointer-events-auto fixed bottom-0 z-[21] w-[100%] lg:top-[85%] lg:mx-auto lg:ml-auto lg:max-w-[1320px]"
        >
          <div className="shadow-lg lg:hidden">
            <BookNow isProperty>
              <CTAButton
                disabled
                text={t(DICTIONARY_CONSTANT.RESERVATIONS.BOOK_NOW)}
                url={url}
                variant="contained-big"
                bgColor="green-primary"
                fontColor="#fff"
                extraStyles="lg:font-semibold"
                extraContainerStyles="h-[50px]"
              />
            </BookNow>
          </div>
          <div className="top-[95%] hidden lg:block">
            {/* ToDo Code/function same as original StayAtEastBanner, just duplicated the version
            before the conversion as i can't get set configuration locally to call property
            StayAtEastBanner, Wen please check when convert CarouselBanner5.. */}
            <StayAtEastBannerSticky
              propertySiteConfiguration={carouselBanner5Props.fields.PropertySiteConfiguration}
            />
          </div>
        </div>
        <div className="flex flex-col  gap-0 overflow-hidden pb-0 lg:mx-0 lg:my-[40px] lg:flex-row lg:pb-[120px] xl:gap-[160px]">
          <div className="relative mx-[15px] xl:mx-0">
            <RoomTitleSlider
              roomTitle={carouselBanner5Props.fields.SelectedArticles[swiperIndex]?.fields.Title}
              url={carouselBanner5Props.fields.SelectedArticles[swiperIndex]?.url}
              index={swiperIndex}
              className="hidden lg:block"
            />
            <Swiper
              slidesPerView={1}
              modules={[FreeMode, Pagination, Autoplay, Controller]}
              onSwiper={setSwiper}
              onSlideChange={(swiper) => moveThumbsToSlide(swiper.realIndex)}
              controller={{ control: swiper }}
              pagination={{ el: '.swiper-pagination', clickable: true }}
              className="carousel2 h-[100%] lg:max-w-[445px]"
              speed={600}
              allowTouchMove={true}
              autoplay={{
                delay: 5000,
                pauseOnMouseEnter: true,
                disableOnInteraction: false,
              }}
            >
              <div className="swiper-pagination h-[7px]"></div>
              {carouselBanner5Props.fields.SelectedArticles.map((swiper, index) => (
                <SwiperSlide key={index} className="pt-[40px]">
                  <SwiperSlideTextContent
                    Title={swiper.fields.Title}
                    Description={swiper.fields.Description}
                    RoomSize={swiper.fields.RoomSize}
                    Capacity={swiper.fields.Capacity}
                    CtaText={carouselBanner5Props.fields.CTAText}
                    Url={swiper.url}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="order-first max-w-[440px] overflow-hidden md:mx-auto lg:order-last lg:max-w-[640px]">
            <Swiper
              slidesPerView={1.4}
              spaceBetween={spaceBetween}
              onSwiper={setThumbsSwiper}
              onSlideChange={(swiper) => {
                moveThumbsToSlide(swiper.realIndex);
              }}
              modules={[Controller]}
              watchSlidesProgress={true}
              className="carousel2-thumbs h-[100%]"
              speed={600}
              slideToClickedSlide={true}
              allowTouchMove={true}
            >
              {carouselBanner5Props.fields.SelectedArticles.map((swiper, index) => (
                <SwiperSlide key={index}>
                  {({ isActive }) => (
                    <AnimatePresence mode="wait">
                      <motion.img
                        animate={{
                          clipPath: isActive ? 'inset(0%)' : 'inset(0% 17.5% 20% 15%)',
                          transform: isActive ? 'scale(1)' : 'scale(0.75)',
                          transition: { duration: 0.5, ease: 'easeInOut' },
                        }}
                        src={swiper.fields.RoomListingImage.value?.src}
                        className="max-h-[318px] w-full max-w-[279px] object-cover lg:max-h-[545px] lg:max-w-[478px]"
                      ></motion.img>
                    </AnimatePresence>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default withDatasourceCheck()<CarouselBanner5Props>(Default);
