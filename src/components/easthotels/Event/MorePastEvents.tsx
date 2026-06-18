import React, { useRef, JSX } from 'react';
import { motion } from 'framer-motion';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import {
  GetServerSideComponentProps,
  useComponentProps,
  useSitecoreContext,
  withDatasourceCheck,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import { useI18n } from 'next-localization';
import HeaderSection from '../Navigation/HeaderSection';
import { NextArrow, PrevArrow } from '../CustomTypes/Components/Arrow';
import useArrow from '@/hooks/useArrow';
import { _PageMetadata } from '@/props/common/_PageMetadata';
import { PageRouteFields } from '@/props/Core/PageProps';
import { GetOfferDetailsService } from '@/graphql/OfferDetailsQuery.service';
import { OfferDetailsField } from '@/props/Graphql/OfferDetailsQueryProps';
import ListingCardGraphQL from '../Article/ListingCardGraphQL';
import { GetSiteStartItemId } from '@/utilities/ContentUtilities';
import ComponentError from '../Error/ComponentError';
import { MorePastEventsProps } from '@/props/Event/MorePastEventsProps';
import { PastEventDetailsField } from '@/props/Graphql/PastEventDetailsQueryProps';
import { GetPastEventDetailsService } from '@/graphql/PastEventDetailsQuery.service';
import { EastIDs, IsIDsIdentical } from '@/utilities/EastIdsConstant';

const fadeinAnimation = {
  initial: { opacity: 0, y: 40 },
  animate: (index: number) => ({ opacity: 1, y: 0, transition: { delay: index * 0.05 } }),
};

const Default = (morePastEventsProps: MorePastEventsProps): JSX.Element => {
  try {
    const swiperRef = useRef<SwiperInstance>(null);
    const { t, locale } = useI18n();
    const slideNext = () => {
      if (swiperRef.current) {
        swiperRef.current.slideNext();
      }
    };

    const slidePrev = () => {
      if (swiperRef.current) {
        swiperRef.current.slidePrev();
      }
    };

    const context = useSitecoreContext();
    const { route } = context.sitecoreContext;
    const pageFields = route?.fields as PageRouteFields & _PageMetadata;
    const pastEventsGraphQL = morePastEventsProps.rendering.uid
      ? useComponentProps<Array<PastEventDetailsField>>(morePastEventsProps.rendering.uid)
      : undefined;

    const { arrowColor } = useArrow(
      pageFields.IsPropertyInnerPage.value,
      pageFields.IsBrandInnerPage.value
    );

    const getBgStyles = () => {
      if (pageFields.IsPropertyInnerPage.value === true) {
        return 'bg-[#E0DAD2] py-[80px]';
      } else if (pageFields.IsBrandInnerPage.value === true) {
        return 'bg-[#D1D3CE] py-[80px]';
      } else {
        return '';
      }
    };

    const sitecoreCss = morePastEventsProps.params?.Styles ?? '';

    return (
      <div className={`${getBgStyles()} relative ${sitecoreCss} `}>
        <div className={`relative mx-auto max-w-[1440px] lg:flex lg:gap-[20px]`}>
          <div className="mx-[15px]  flex items-center justify-between lg:ml-[50px] lg:mr-0 lg:min-w-[360px]">
            <HeaderSection
              heading1={morePastEventsProps.fields.Heading1}
              heading2={morePastEventsProps.fields.Heading2}
              className="mr-[10px]"
              textVariant={'h2'}
            />
            <div className=" hidden lg:block">
              <PrevArrow className={`carousel4-prev-arrow ${arrowColor}`} onClick={slidePrev} />
            </div>
            <div className="flex gap-3  lg:hidden">
              <PrevArrow className={`carousel4-prev-arrow ${arrowColor}`} onClick={slidePrev} />
              <NextArrow className={`carousel4-next-arrow ${arrowColor}`} onClick={slideNext} />
            </div>
          </div>
          <div className="relative overflow-hidden">
            <div className="mx-[15px] overflow-hidden lg:ml-0 lg:mr-[50px]">
              <Swiper
                slidesPerView={'auto'}
                spaceBetween={30}
                navigation={{
                  nextEl: '.carousel4-next-arrow',
                  prevEl: '.carousel4-prev-arrow',
                }}
                modules={[Navigation]}
                className="carousel4 h-[100%]"
              >
                {
                  pastEventsGraphQL && pastEventsGraphQL?.map((article: OfferDetailsField, index) => {
                    const constructedUrl = {
                      URL: article.url.path,
                      Text: t(DICTIONARY_CONSTANT.GENERAL.CAROUSEL_BANNER_4_LINK_TEXT),
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
                          <ListingCardGraphQL
                            articleCard={article}
                            articleTag={article.articleTag.jsonValue?.fields}
                            cta={constructedUrl}
                            imgClassName={'w-[400px] h-[250px] object-cover'}
                          />
                        </motion.div>
                      </SwiperSlide>
                    );
                  })
                }
              </Swiper>
            </div>
            <div className="hidden lg:flex">
              <NextArrow className={`carousel4-next-arrow ${arrowColor}`} onClick={slideNext} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />
  }
};

export default withDatasourceCheck()<MorePastEventsProps>(Default);

export const getServerSideProps: GetServerSideComponentProps = async (rendering, layoutData) => {
  const { route, context } = layoutData?.sitecore;

  const isEventDetailPageTemplate = IsIDsIdentical(route?.templateId!, EastIDs.PAST_EVENT_DETAIL_TEMPLATE)

  var startItem = GetSiteStartItemId(context.itemPath);
  var offers = await GetPastEventDetailsService(
    startItem,
    layoutData?.sitecore?.context?.language!,
    isEventDetailPageTemplate ? route?.itemId! : EastIDs.EASTHOTELS_EMPTY_ID,
    ''
  );
  return offers;
};
