import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { motion } from 'framer-motion';
import useWindowSize from '@/hooks/useWindowSize';
import {
  ComponentRendering,
  GetServerSideComponentProps,
  useComponentProps,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { NextArrow, PrevArrow } from '../CustomTypes/Components/Arrow';
import useArrow from '@/hooks/useArrow';
import { _PageMetadata } from '@/props/common/_PageMetadata';
import { PageRouteFields } from '@/props/Core/PageProps';
import { ComponentProps } from 'lib/component-props';
import { GetSiteStartItemId } from '@/utilities/ContentUtilities';
import { GetEatAndDrinkDetailsService } from '@/graphql/EatAndDrinkDetailsQuery.service';
import { EatAndDrinkDetailsField } from '@/props/Graphql/EatAndDrinkDetailsQueryProps';
import ListingCardGraphQL from '../Article/ListingCardGraphQL';
import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import { IsIDsIdentical } from '@/utilities/EastIdsConstant';
import ComponentError from '../Error/ComponentError';

export type OtherEatAndDrinkProps = ComponentProps & {
  rendering: ComponentRendering;
};

const fadeinAnimation = {
  initial: { opacity: 0, y: 40 },
  animate: (index: number) => ({ opacity: 1, y: 0, transition: { delay: index * 0.05 } }),
};

export const Default = (otherEatAndDrinkProps: OtherEatAndDrinkProps) => {
  try {
    const { t } = useI18n();
    const windowWidth = useWindowSize().windowSize?.width;
    const sitecoreCss = otherEatAndDrinkProps.params?.Styles ?? '';
    const context = useSitecoreContext();
    const { route } = context.sitecoreContext;
    const pageFields = route?.fields as PageRouteFields & _PageMetadata;

    const eatAndDrinksGraphQL = otherEatAndDrinkProps.rendering.uid
      ? useComponentProps<Array<EatAndDrinkDetailsField>>(otherEatAndDrinkProps.rendering.uid)
      : undefined;

    const { arrowColor } = useArrow(
      pageFields.IsPropertyInnerPage.value,
      pageFields.IsBrandInnerPage.value
    );

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
            {eatAndDrinksGraphQL &&
              eatAndDrinksGraphQL.map((article, index) => {
                const constructedUrl = {
                  URL: article.url.path as string,
                  Text: t(DICTIONARY_CONSTANT.CTA.EAT_AND_DRINK_VIEW_DETAIL),
                  URL2: article.url.path as string,
                  Text2: t(DICTIONARY_CONSTANT.CTA.EAT_AND_DRINK_VIEW_DETAIL),
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
                        cta={constructedUrl}
                        className={'w-[360px]'}
                        imgClassName={'aspect-square w-[360px] object-cover'}
                      />
                    </motion.div>
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

export const getServerSideProps: GetServerSideComponentProps = async (rendering, layoutData) => {
  const { route, context } = layoutData?.sitecore;

  var startItem = GetSiteStartItemId(context.itemPath);
  var fullEatAndDrinks = await GetEatAndDrinkDetailsService(
    startItem,
    layoutData?.sitecore?.context?.language!,
    ''
  );

  // Filter out current eat and drink page (in eat & drink detail page)
  fullEatAndDrinks = fullEatAndDrinks.filter((item, index) => {
    return !IsIDsIdentical(item.id, route?.itemId!);
  });

  return fullEatAndDrinks;
};
