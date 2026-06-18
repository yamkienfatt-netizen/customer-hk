import React, { ReactNode, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { motion } from 'framer-motion';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import ListingCard from 'components/easthotels/Article/ListingCard';
import { Field, TextField } from '@sitecore-jss/sitecore-jss-nextjs';
import { _ArticleCard } from '@/props/common/_ArticleCard';
import { SpeakerBioLightbox } from '../Event/SpeakerBioLightbox';
import Typography from '../Typography/Typography';
import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import { PrevArrow, NextArrow } from '../CustomTypes/Components/Arrow';
import useArrow from '@/hooks/useArrow';
import ComponentError from '../Error/ComponentError';

const publicUrl = getPublicUrl();

const fadeinAnimation = {
  initial: { opacity: 0, y: 40 },
  animate: (index: number) => ({ opacity: 1, y: 0, transition: { delay: index * 0.05 } }),
};

// reusable module - currently used in header menu and ITWUT Campaign (EventListingMultiple)
const ListingSwiper = ({
  articleData,
  spaceBetween = 40,
  isMenu = false,
  isPropertyPage,
  CTAButtonOpensLightbox,
  closeMenu,
}: {
  articleData: any;
  spaceBetween?: number;
  customCTABtn?: ReactNode;
  isMenu?: boolean;
  onClickCTAButton?: () => void | undefined;
  isPropertyPage?: Field<boolean>;
  CTAButtonOpensLightbox?: Field<boolean>;
  closeMenu?: () => void | undefined;
}) => {
  try {
    const selectedArticles = !isMenu
      ? articleData.fields.SelectedArticles
      : articleData.fields.SelectedLinks;

    const { t } = useI18n();

    const { arrowColor } = useArrow(
      isPropertyPage?.value === true,
      isPropertyPage?.value === false
    );

    return (
      //mt-[-20px]
      <div className={`relative ml-[15px] lg:ml-[50px]`}>
        <div className="hidden lg:block">
          <PrevArrow
            className={`listing-swiper-prev-arrow absolute left-[-20px] top-[55%]  ${arrowColor}`}
          />
          <NextArrow
            className={`listing-swiper-next-arrow absolute right-[30px] top-[55%]  ${arrowColor}`}
          />
        </div>
        <div className="mx-auto flex">
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
            {selectedArticles.map((article, index) => {
              const constructedUrl = {
                URL: article.fields.URL,
                Text: article.fields.Text as TextField,
                URL2: article.fields.URL2,
                Text2: article.fields.Text2 as TextField,
              };

              // article.cta && constructedUrl = {
              //   URL: article.cta.url,
              //   Text: article.cta.text as TextField,
              // };

              const customCTABtn =
                CTAButtonOpensLightbox?.value && article.fields.Content.value ? (
                  <SpeakerBioLightbox articleCard={article.fields}>
                    <Typography
                      variant="l1"
                      fontWeight="bold"
                      underline
                      extraStyles="border-black-secondary hover:cursor-pointer"
                    >
                      {t(DICTIONARY_CONSTANT.GENERAL.READ_BIO_BUTTON)}
                    </Typography>
                  </SpeakerBioLightbox>
                ) : null;

              // console.log('article.fields', article.fields);

              return (
                <SwiperSlide key={index} className="w-[300px] max-w-[300px] last:mr-0">
                  {/* <motion.div
                    key={index}
                    variants={fadeinAnimation}
                    initial="initial"
                    whileInView="animate"
                    custom={index}
                  > */}
                  <ListingCard
                    articleData
                    articleCard={article.fields ? article.fields : article}
                    cta={constructedUrl}
                    customCTABtn={customCTABtn}
                    className={'headerMenuCard'}
                    imgClassName={'headerMenuCardImg'}
                    closeMenu={closeMenu}
                  />
                  {/* </motion.div> */}
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

export default ListingSwiper;
