import React, { useRef, useState, JSX } from 'react';
import { motion } from 'framer-motion';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';

import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
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
import Arrow, { NextArrow, PrevArrow } from '../CustomTypes/Components/Arrow';
import useArrow from '@/hooks/useArrow';
import { _PageMetadata } from '@/props/common/_PageMetadata';
import { PageRouteFields } from '@/props/Core/PageProps';
import { GetOfferDetailsService } from '@/graphql/OfferDetailsQuery.service';
import { OfferDetailsField } from '@/props/Graphql/OfferDetailsQueryProps';
import { MoreOffersField, MoreOffersProps } from '@/props/Media/MoreOffersProps';
import ListingCard from '../Article/ListingCard';
import ListingCardGraphQL from '../Article/ListingCardGraphQL';
import { EastIDs, IsIDsIdentical } from '@/utilities/EastIdsConstant';
import { GetSiteStartItemId } from '@/utilities/ContentUtilities';
import ComponentError from '../Error/ComponentError';
import { cn } from 'lib/utils';
import useWindowSize from '@/hooks/useWindowSize';

const fadeinAnimation = {
  initial: { opacity: 0, y: 40 },
  animate: (index: number) => ({ opacity: 1, y: 0, transition: { delay: index * 0.05 } }),
};

const Default = (moreOffersProps: MoreOffersProps): JSX.Element => {
  try {
    const swiperRef = useRef<SwiperRef>(null);
    const [paginationBtn, setPaginationBtn] = useState({
      isBeginning: true,
      isEnd: false,
    });
    const { t, locale } = useI18n();
    const { isMobile } = useWindowSize();

    const context = useSitecoreContext();
    const { route } = context.sitecoreContext;
    const pageFields = route?.fields as PageRouteFields & _PageMetadata;
    const offersGraphQL = moreOffersProps.rendering.uid
      ? useComponentProps<Array<OfferDetailsField>>(moreOffersProps.rendering.uid)
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

    const sitecoreCss = moreOffersProps.params?.Styles ?? '';

    return (
      <div className={`${getBgStyles()} relative ${sitecoreCss} `}>
        <div className={`relative mx-auto max-w-[1440px] lg:flex lg:gap-[20px]`}>
          {/* lg:ml-[50px]  */}
          <div className="mx-[15px] flex items-center justify-between lg:mr-0 lg:min-w-[360px]">
            <HeaderSection
              heading1={moreOffersProps.fields?.Heading1}
              heading2={moreOffersProps.fields?.Heading2}
              className="mr-[10px]"
              textVariant={'h2'}
            />
            <div className=" hidden lg:block">
              <PrevArrow className={cn(
                `carousel4-prev-arrow transition-opacity duration-200`,
                arrowColor,
                paginationBtn.isBeginning && 'opacity-0 pointer-events-none'
              )} />
            </div>
            <div className="flex gap-3  lg:hidden">
              <PrevArrow className={cn(
                `carousel4-prev-arrow transition-opacity duration-200`,
                arrowColor,
                paginationBtn.isBeginning && 'opacity-0 pointer-events-none'
              )} />
              <NextArrow className={cn(
                `carousel4-next-arrow transition-opacity duration-200`,
                arrowColor,
                paginationBtn.isEnd && 'opacity-0 pointer-events-none'
              )} />
            </div>
          </div>
          <div className="relative overflow-hidden">
            {/* lg:mr-[50px] */}
            <div className="mx-[15px] overflow-hidden lg:mx-0">
              <Swiper
                ref={swiperRef}
                onSlideChangeTransitionStart={(swiper) => {
                  setPaginationBtn({
                    isBeginning: swiper.isBeginning,
                    isEnd: swiper.isEnd,
                  })
                }}
                slidesPerView={'auto'}
                spaceBetween={30}
                navigation={{
                  nextEl: '.carousel4-next-arrow',
                  prevEl: '.carousel4-prev-arrow',
                }}
                modules={[Navigation]}
                className="carousel4 h-[100%]"
              >
                {moreOffersProps.fields?.SelectedArticles.length > 0
                  ? moreOffersProps.fields?.SelectedArticles.map((article, index) => {
                    const constructedUrl = {
                      URL: article.url,
                      Text: t(DICTIONARY_CONSTANT.GENERAL.CAROUSEL_BANNER_4_LINK_TEXT),
                    };
                    return (
                      <SwiperSlide key={index}>
                        {/* <motion.div
                          key={index}
                          variants={fadeinAnimation}
                          initial="initial"
                          whileInView="animate"
                          custom={index}
                        > */}
                        <ListingCard
                          articleCard={article.fields}
                          articleTag={article.fields.ArticleTag.fields}
                          cta={constructedUrl}
                          imageClipOverEffect={false}
                          className={'max-[450px]:!max-w-[250px] max-w-[340px]'}
                          imgClassName={'w-full object-cover aspect-[340/202]'}
                        />
                        {/* </motion.div> */}
                      </SwiperSlide>
                    );
                  })
                  : offersGraphQL?.map((article: OfferDetailsField, index) => {
                    const constructedUrl = {
                      URL: article.url.path,
                      Text: t(DICTIONARY_CONSTANT.GENERAL.CAROUSEL_BANNER_4_LINK_TEXT),
                    };
                    return (
                      <SwiperSlide key={index}>
                        {/* <motion.div
                            key={index}
                            variants={fadeinAnimation}
                            initial="initial"
                            whileInView="animate"
                            custom={index}
                          > */}
                        <ListingCardGraphQL
                          articleCard={article}
                          articleTag={article.articleTag.jsonValue?.fields}
                          cta={constructedUrl}
                          imageClipOverEffect={false}
                          imgClassName={'w-full object-cover aspect-[340/202]'}
                        />
                        {/* </motion.div> */}
                      </SwiperSlide>
                    );
                  })}
              </Swiper>
            </div>
            <div className="hidden lg:flex">
              <NextArrow className={cn(
                `carousel4-next-arrow transition-opacity duration-200`,
                arrowColor,
                paginationBtn.isEnd && 'opacity-0 pointer-events-none'
              )} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default withDatasourceCheck()<MoreOffersProps>(Default);

export const getServerSideProps: GetServerSideComponentProps = async (rendering, layoutData) => {
  const { route, context } = layoutData?.sitecore;

  const selectedArticles = (rendering.fields as MoreOffersField)?.SelectedArticles;
  if (selectedArticles?.length == 0) {
    const isOfferDetailPageTemplate = IsIDsIdentical(route?.templateId!, EastIDs.OFFER_DETAIL_TEMPLATE)
    var startItem = GetSiteStartItemId(context.itemPath);
    var offers = await GetOfferDetailsService(
      startItem,
      layoutData?.sitecore?.context?.language!,
      isOfferDetailPageTemplate ? route?.itemId! : EastIDs.EASTHOTELS_EMPTY_ID,
      ''
    );

    return offers;
  }
  return [];
};
