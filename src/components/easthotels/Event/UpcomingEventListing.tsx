import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { motion } from 'framer-motion';
import {
  ComponentRendering, GetServerSideComponentProps, useComponentProps, useSitecoreContext,
  Text as ScText,
  LinkField,
  TextField,
} from '@sitecore-jss/sitecore-jss-nextjs';
import useWindowSize from '@/hooks/useWindowSize';
import { NextArrow, PrevArrow } from '../CustomTypes/Components/Arrow';
import useArrow from '@/hooks/useArrow';
import { GetITWUTEventDetailsService } from '@/graphql/ITWUTEventDetailsQuery.service';
import { _PageMetadata } from '@/props/common/_PageMetadata';
import { PageRouteFields } from '@/props/Core/PageProps';
import { ComponentProps } from 'lib/component-props';
import { ItwutEventDetailsField } from '@/props/Graphql/ItwutEventDetailsQueryProps';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import { useI18n } from 'next-localization';
import { _ArticleCard, _ArticleCardGraphQL } from '@/props/common/_ArticleCard';
import Typography from '../Typography/Typography';
import ImageClipOnHover from '../Animation/ImageClipOnHover';
import CTAButton from '../Button/CTAButton';
import ComponentError from '../Error/ComponentError';

export type UpcomingEventListingProps = ComponentProps & {
  rendering: ComponentRendering;
};

const fadeinAnimation = {
  initial: { opacity: 0, y: 40 },
  animate: (index: number) => ({ opacity: 1, y: 0, transition: { delay: index * 0.05 } }),
};

const ListingCard = ({
  articleCard,
  cta
}: {
  articleCard: _ArticleCardGraphQL;
  cta?: { URL: string; Text: string; };
}) => {
  try {
    const imageWidth = articleCard.image.value?.width?.toString()
      ? articleCard.image.value?.width?.toString()
      : '400';

    return (
      <div style={{ maxWidth: `${imageWidth}px` }} >
        <div className="mb-[25px] flex gap-[3px]">
          {(articleCard.legend) && (
            <Typography variant="l3" fontWeight="bold">
              <ScText field={articleCard.legend} />
            </Typography>
          )}
          {(articleCard.legend2) && (
            <Typography variant="l3" fontWeight="semiBold">
              <ScText field={articleCard.legend2} />
            </Typography>
          )}
        </div>
        <a href={cta?.URL}>
          <ImageClipOnHover
            src={articleCard.image.value?.src?.toString()!}
            alt={`${articleCard.title?.value?.toString() ? articleCard.title.value?.toString() : ''} IMG`}
          />
        </a>
        {(articleCard.title) && (
          <a href={cta?.URL}>
            <div className="mt-[20px]">
              <Typography variant="h4">
                <ScText field={articleCard.title} />
              </Typography>
            </div>
          </a>
        )}
        {(articleCard.subTitle) && (
          <div className="mb-[20px] mt-[10px] lg:mb-[25px]">
            <Typography variant="p">
              <ScText field={articleCard.subTitle} />
            </Typography>
          </div>
        )}
        <div className="mb-[25px]">
          {articleCard.date && articleCard.time && (
            <>
              <Typography variant="p" extraStyles="lg:hidden">
                {articleCard.date.value + ' | ' + articleCard.time.value}
              </Typography>
              <Typography variant="p" extraStyles="hidden lg:block">
                <ScText field={articleCard.date} />
              </Typography>
              <Typography variant="p" extraStyles="hidden lg:block">
                <ScText field={articleCard.time} />
              </Typography>
            </>
          )}
          {(articleCard.location) && (
            <div>
              <Typography variant="p">
                <ScText field={articleCard.location} />
              </Typography>
            </div>
          )}
        </div>

        {(articleCard.description) && (
          <div className="my-[25px]">
            <Typography variant="p">
              <ScText field={articleCard.description} />
            </Typography>
          </div>
        )}

        <div className="flex gap-[20px]">
          {cta?.URL && cta?.Text && (
            <CTAButton url={cta?.URL as string} text={cta?.Text as string} variant="underlined" />
          )}
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />
  }
};

export const Default = (upcomingEventListingProps: UpcomingEventListingProps) => {
  try {
    const { t } = useI18n();
    const windowWidth = useWindowSize().windowSize?.width;
    const context = useSitecoreContext();
    const { route } = context.sitecoreContext;
    const pageFields = route?.fields as PageRouteFields & _PageMetadata;
    const { arrowColor } = useArrow(pageFields.IsPropertyInnerPage.value, pageFields.IsBrandInnerPage.value);

    const sitecoreCss = upcomingEventListingProps.params?.Styles ?? '';

    const upcomingEventDetails = upcomingEventListingProps.rendering.uid ? useComponentProps<Array<ItwutEventDetailsField>>(upcomingEventListingProps.rendering.uid) : undefined;


    return (
      <div className={'medium-section-container ' + sitecoreCss}>
        <div
          className={`relative ml-[15px] flex flex-nowrap overflow-x-auto scrollbar-hide lg:pl-[50px] ${~~windowWidth! >= 1500 ? 'lg:pr-[50px]' : 'lg:pr-[0px]'}`}
        >
          <div className="hidden lg:block">
            <PrevArrow
              className={`event-listing-prev-arrow absolute bottom-[293px] left-[30px]  ${arrowColor}`}
            />
            <NextArrow
              className={`event-listing-next-arrow absolute bottom-[293px] right-[30px]  ${arrowColor}`}
            />
          </div>
          <Swiper
            slidesPerView={'auto'}
            spaceBetween={40}
            navigation={{
              nextEl: '.event-listing-next-arrow',
              prevEl: '.event-listing-prev-arrow',
            }}
            modules={[Navigation]}
            className="carousel4 h-[100%]"
          >
            {upcomingEventDetails &&
              upcomingEventDetails.map((article, index) => {
                const constructedUrl = {
                  URL: article.url.path,
                  Text: t(DICTIONARY_CONSTANT.CTA.UPCOMINGEVENTLISTING_MOREDETAIL),
                };

                return (
                  <SwiperSlide key={index}>
                    <motion.div
                      key={index}
                      variants={fadeinAnimation}
                      initial="initial"
                      whileInView="animate"
                      custom={index}
                    >
                      <ListingCard articleCard={article} cta={constructedUrl} />
                    </motion.div>
                  </SwiperSlide>
                );
              })}
          </Swiper>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />
  }
};



export const getServerSideProps: GetServerSideComponentProps = async (rendering, layoutData) => {
  const { route } = layoutData?.sitecore;
  const pageFields = route?.fields as PageRouteFields & _PageMetadata;

  var startItem = pageFields.IsPropertyPage.value ? route?.itemId! : "6772036A-C368-4D13-B0C6-A86F124A5B8A";
  var fullEvents = await GetITWUTEventDetailsService(startItem, layoutData?.sitecore?.context?.language!, "")

  const pastEventDetails = fullEvents?.filter((event) => {
    const parsedDate = Date.parse(event.eventDate.jsonValue.value! as string);
    return parsedDate >= Date.now();
  });

  return pastEventDetails;
};

