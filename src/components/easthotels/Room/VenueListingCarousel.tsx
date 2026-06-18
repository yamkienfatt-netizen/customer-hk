import React, { ReactNode } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { motion } from 'framer-motion';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import {
  GetServerSideComponentProps,
  TextField,
  useComponentProps,
  useSitecoreContext,
  Text as ScText,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { _ArticleCard } from '@/props/common/_ArticleCard';
import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import CTAButton from '../Button/CTAButton';
import Typography from '../Typography/Typography';
import ImageClipOnHover from '../Animation/ImageClipOnHover';
import { NextArrow, PrevArrow } from '../CustomTypes/Components/Arrow';
import useArrow from '@/hooks/useArrow';
import { _PageMetadata } from '@/props/common/_PageMetadata';
import { PageRouteFields } from '@/props/Core/PageProps';
import { GetSiteStartItemId } from '@/utilities/ContentUtilities';
import { GetVenueDetailsService } from '@/graphql/VenueDetailsQuery.service';
import { IsIDsIdentical } from '@/utilities/EastIdsConstant';
import { ComponentProps } from 'lib/component-props';
import { VenueDetailsField } from '@/props/Graphql/VenueDetailsQueryProps';
import config from 'temp/config';
import ComponentError from '../Error/ComponentError';

const VenueListingCardGraphql = ({
  article,
  index,
  isVenueDetail,
}: {
  article: VenueDetailsField;
  index: number;
  isVenueDetail: boolean;
}) => {
  try {
    const { t } = useI18n();

    const constructedUrl = {
      URL: article.url.path as string,
      Text: t(DICTIONARY_CONSTANT.CTA.LISTING_SWIPER_VIEW_DETAIL),
    };

    const imageWidth =
      article?.image.value?.width?.toString() < '325'
        ? article?.image.value?.width?.toString()
        : '325';

    const fadeinAnimation = {
      initial: { opacity: 0, y: 40 },
      animate: { opacity: 1, y: 0, transition: { delay: index * 0.05 } },
    };

    return (
      <motion.div
        key={index}
        variants={fadeinAnimation}
        initial="initial"
        whileInView="animate"
        custom={index}
      >
        <div style={{ maxWidth: `${imageWidth}px` }} className="max-[450px]:!max-w-[250px]">
          <div className="flex flex-col gap-[20px]">
            <a href={constructedUrl.URL}>
              <ImageClipOnHover
                src={article?.image.jsonValue.value.src}
                alt={`${article.title?.value?.toString() ? article.title.value?.toString() : ''} IMG`}
              />
            </a>
            <div>
              <a href={constructedUrl.URL}>
                <Typography variant="h4">
                  <ScText field={article.title} />
                </Typography>
              </a>

              {!isVenueDetail && (
                <Typography
                  variant="l1"
                  fontWeight="bold"
                  fontColor="#1D20214D"
                  extraStyles="mt-[10px]"
                >
                  <ScText field={article.roomTag} />
                </Typography>
              )}

              <div className="my-[30px] flex flex-row gap-[40px]">
                <div>
                  <div className="flex gap-[5px]">
                    <Typography variant="l2" fontWeight="bold">
                      {t(DICTIONARY_CONSTANT.STAYS.VENUE_SIZE)}
                    </Typography>
                  </div>
                  <Typography variant="l1">
                    <ScText field={article.venueSize} />
                  </Typography>
                </div>
                <div>
                  <div className="flex gap-[5px]">
                    <Typography variant="l2" fontWeight="bold">
                      {t(DICTIONARY_CONSTANT.STAYS.MEETING_EVENT_CAPACITY)}
                    </Typography>
                  </div>
                  <Typography variant="l1">
                    <ScText field={article.capacity} />
                  </Typography>
                </div>
              </div>

              <CTAButton text={constructedUrl.Text} url={constructedUrl.URL} variant="underlined" />
            </div>
          </div>
        </div>
      </motion.div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

const Default = (componentProps: ComponentProps) => {
  try {
    const venueDetailGraphQL = componentProps.rendering.uid
      ? useComponentProps<Array<VenueDetailsField>>(componentProps.rendering.uid)
      : undefined;

    const context = useSitecoreContext();
    const { route } = context.sitecoreContext;
    const pageFields = route?.fields as PageRouteFields & _PageMetadata;

    const { arrowColor } = useArrow(
      pageFields.IsPropertyInnerPage.value,
      pageFields.IsBrandInnerPage.value
    );

    const sitecoreCss = componentProps.params?.Styles ?? '';

    const isVenueDetail = componentProps?.fields?.IsVenueDetail?.value || false;

    return (
      <div className={'medium-section-container' + sitecoreCss}>
        <div className={`relative ml-[15px] lg:ml-[50px]`}>
          <div className="hidden lg:block">
            <PrevArrow
              className={`venue-listing-prev-arrow absolute left-[-20px] top-[55%]  ${arrowColor}`}
            />
            <NextArrow
              className={`venue-listing-next-arrow absolute right-[30px] top-[55%] ${arrowColor}`}
            />
          </div>
          <Swiper
            slidesPerView={'auto'}
            spaceBetween={20}
            navigation={{
              nextEl: '.venue-listing-next-arrow',
              prevEl: '.venue-listing-prev-arrow',
            }}
            modules={[Navigation]}
            slidesOffsetAfter={15}
            className="carousel4 h-[100%]"
            breakpoints={{
              450: {
                spaceBetween: 40,
              },
            }}
          >
            {venueDetailGraphQL &&
              venueDetailGraphQL.map((article, index) => {
                return (
                  <SwiperSlide key={index}>
                    <VenueListingCardGraphql
                      article={article}
                      index={index}
                      isVenueDetail={isVenueDetail}
                    />
                  </SwiperSlide>
                );
              })}
          </Swiper>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default Default;

export const getServerSideProps: GetServerSideComponentProps = async (rendering, layoutData) => {
  const { route, context } = layoutData?.sitecore;

  var startItem = GetSiteStartItemId(context.itemPath);
  var rooms = await GetVenueDetailsService(startItem, layoutData?.sitecore?.context?.language!, '');

  // Filter out current venue detail page
  rooms = rooms.filter((item, index) => {
    return !IsIDsIdentical(item.id, route?.itemId!);
  });

  return rooms;
};
