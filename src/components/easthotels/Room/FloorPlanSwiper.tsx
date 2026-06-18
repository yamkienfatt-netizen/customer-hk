import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Typography from '../Typography/Typography';
import { Navigation, Pagination } from 'swiper/modules';
import CTAButton from '../Button/CTAButton';
import CatFilter from '../CustomTypes/Components/CatFilter';
import { _ResidenceStayDetail } from '@/props/common/_ResidenceStayDetail';
import {
  Text as ScText,
  Image as ScImage,
  LinkField,
  useSitecoreContext,
  LayoutServicePageState,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { Treelist } from '@/props/fields/ScField';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import { useI18n } from 'next-localization';
import ComponentError from '../Error/ComponentError';
interface FloorPlanSwiperProp {
  data: Treelist<_ResidenceStayDetail>[];
  swiperMaxWidth: number;
  onClickPaginationItem: (index: number) => void;
}

interface FloorPlanPaginationProp {
  data: Treelist<_ResidenceStayDetail>[];
  activeIndex: number;
  onClickPaginationItem: (index: number) => void;
}

const FloorPlanPagination = ({
  data,
  activeIndex,
  onClickPaginationItem,
}: FloorPlanPaginationProp) => {
  const dataForMobileCatFilter = data.map(
    (item: Treelist<_ResidenceStayDetail>) => item.fields.RoomTitle.value
  );
  try {
    return (
      <div className="overflow-auto lg:flex lg:gap-[20px] custom-scrollbar">
        {data.map((item: any, index: number) => {
          const isActive = activeIndex === index;
          return (
            <div
              className={`hidden hover:cursor-pointer lg:flex lg:flex-nowrap`}
              key={item.fields.RoomTitle + index}
            >
              <Typography
                variant="l1"
                fontWeight="bold"
                underline
                onClick={() => onClickPaginationItem(index)}
                extraStyles={`whitespace-nowrap ${isActive ? 'text-black-secondary border-black-secondary' : 'border-[#CFCFCF] text-[#CFCFCF]'}`}
              >
                <ScText field={item.fields.RoomTitle} />
              </Typography>
            </div>
          );
        })}

        <CatFilter
          cats={dataForMobileCatFilter}
          selectedCat={dataForMobileCatFilter[activeIndex]}
          onClickCat={(cat, index) => {
            onClickPaginationItem(index);
          }}
          className={'lg:hidden'}
        />
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />
  }
};

const FloorPlanSwiper = forwardRef(
  ({ data, swiperMaxWidth, onClickPaginationItem }: FloorPlanSwiperProp, ref) => {
    try {
      const [activeIndex, setActiveIndex] = useState(0);
      const { t } = useI18n();
      const { sitecoreContext } = useSitecoreContext();
      const isPageEditing = sitecoreContext.pageState === LayoutServicePageState.Edit;

      return (
        <div className="mx-[15px] lg:mx-[50px]">
          <div className="sticky top-[70px] z-10 lg:mb-[32px] flex w-full justify-center bg-property bg-opacity-90 py-[15px] backdrop-blur-xl lg:hidden">
            <FloorPlanPagination
              data={data}
              activeIndex={activeIndex}
              onClickPaginationItem={(index: number) =>
                // swiperRef.current && swiperRef.current.swiper.slideTo(index)
                onClickPaginationItem(index)
              }
            />
          </div>

          <Swiper
            ref={ref}
            // slidesPerView={1}
            allowTouchMove={false}
            onActiveIndexChange={({ realIndex }) => {
              setActiveIndex(realIndex);
            }}
            centeredSlides={true}
            modules={[Pagination, Navigation]}
            // className="carousel4 h-[100%] max-w-[590px]"
            className="carousel4 h-[100%]"
          // style={{ maxWidth: swiperMaxWidth }}
          >
            {data.map((item: Treelist<_ResidenceStayDetail>, index: number) => {
              return (
                <SwiperSlide key={index}>
                  <div className="flex flex-col items-center lg:items-start">
                    {isPageEditing || item?.fields.VirtualTourLink?.value?.href ? (
                      <CTAButton
                        url={item?.fields.VirtualTourLink as LinkField}
                        text={t(DICTIONARY_CONSTANT.STAYS.VIRTUAL_TOUR) as string}
                        variant="underlined"
                        extraContainerStyles="hidden lg:block lg:mb-[16px]"
                      />
                    ) : (
                      <div className="mb-[30px] hidden lg:block" />
                    )}

                    <ScImage
                      field={item.fields.FloorPlan}
                      className="max-h-[256px] max-w-[345px] lg:h-full lg:max-h-[438px] lg:w-full lg:max-w-[590px]"
                    />

                    {(isPageEditing || item?.fields.VirtualTourLink?.value?.href) && (
                      <CTAButton
                        url={item?.fields.VirtualTourLink as LinkField}
                        text={t(DICTIONARY_CONSTANT.STAYS.VIRTUAL_TOUR) as string}
                        variant="underlined"
                        extraContainerStyles="lg:hidden mb-[50px] mt-[30px]"
                      />
                    )}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          <div className="mt-[30px] hidden lg:block">
            <FloorPlanPagination
              data={data}
              activeIndex={activeIndex}
              onClickPaginationItem={(index: number) =>
                // swiperRef.current && swiperRef.current.swiper.slideTo(index)
                onClickPaginationItem(index)
              }
            />
          </div>
        </div>
      );
    } catch (err) {
      return <ComponentError error={err} />
    }
  }
);

export default FloorPlanSwiper;
