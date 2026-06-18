import React, { ReactNode } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { motion } from 'framer-motion';
import { Field } from '@sitecore-jss/sitecore-jss-nextjs';
import { _ArticleCard } from '@/props/common/_ArticleCard';
import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import { PrevArrow, NextArrow } from '../CustomTypes/Components/Arrow';
import useArrow from '@/hooks/useArrow';
import ListingCardGraphQL from './ListingCardGraphQL';
import { RoomDetailsField } from '@/props/Graphql/RoomDetailsQueryProps';
import ComponentError from '../Error/ComponentError';

const fadeinAnimation = {
  initial: { opacity: 0, y: 40 },
  animate: (index: number) => ({ opacity: 1, y: 0, transition: { delay: index * 0.05 } }),
};

// reusable module - currently used in header menu and ITWUT Campaign (EventListingMultiple)
const ListingSwiperGraphQL = ({
  articleData,
  spaceBetween = 40,
  isPropertyPage,
  currentPageId,
  compareUrl,
  isStay = false,
}: {
  articleData: Array<RoomDetailsField>;
  spaceBetween?: number;
  customCTABtn?: ReactNode;
  onClickCTAButton?: () => void | undefined;
  isPropertyPage?: Field<boolean>;
  compareUrl: string;
  currentPageId: string;
  isStay?: boolean;
}) => {
  try {
    const { t } = useI18n();
    const { arrowColor } = useArrow(
      isPropertyPage?.value === true,
      isPropertyPage?.value === false
    );

    return (
      <div className={`relative ml-[15px] lg:ml-[50px]`}>
        <div className="hidden lg:block">
          <PrevArrow
            className={`listing-swiper-prev-arrow absolute left-[-20px] top-[55%]  ${arrowColor}`}
          />
          <NextArrow
            className={`listing-swiper-next-arrow absolute right-[30px] top-[55%]  ${arrowColor}`}
          />
        </div>
        <Swiper
          slidesPerView={'auto'}
          spaceBetween={spaceBetween}
          navigation={{
            nextEl: '.listing-swiper-next-arrow',
            prevEl: '.listing-swiper-prev-arrow',
          }}
          modules={[Navigation]}
          className="carousel4 h-[100%]"
        >
          {articleData &&
            articleData.map((article, index) => {
              const constructedUrl = {
                URL: article.url.path as string,
                Text: t(DICTIONARY_CONSTANT.CTA.LISTING_SWIPER_VIEW_DETAIL),
                URL2: compareUrl.includes('?')
                  ? `${compareUrl}&itm1=${currentPageId}&itm2=${article.id}`
                  : `${compareUrl}?&itm1=${currentPageId}&itm2=${article.id}`,
                Text2: t(DICTIONARY_CONSTANT.CTA.LISTING_SWIPER_COMPARE),
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
                      isStay={isStay}
                      isMultipleUrl={compareUrl && compareUrl != ''}
                      imgClassName={'lg:max-w-[363px] aspect-square object-cover'}
                    />
                  </motion.div>
                </SwiperSlide>
              );
            })}
        </Swiper>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default ListingSwiperGraphQL;
