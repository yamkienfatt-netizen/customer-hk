import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Typography from '../Typography/Typography';
import { Navigation, Pagination } from 'swiper/modules';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import { _StayDetail } from '@/props/common/_StayDetail';
import { Treelist } from '@/props/fields/ScField';
import {
  Text as ScText,
  RichText as ScRichText,
  Image as ScImage,
  RichTextField,
  useSitecoreContext,
  LayoutServicePageState,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { _ResidenceStayDetail } from '@/props/common/_ResidenceStayDetail';
import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import { RoomInfoTemplateProps } from '@/props/PageContent/RoomInfoTemplateProps';
import RichTextTypography from '../Typography/RichTextTypography';
import { _VenueDetail } from '@/props/common/_VenueDetail';
import { MeetingRoomInfoTemplateProps } from '@/props/PageContent/MeetingRoomInfoTemplateProps';
import RoomFeaturesSmall from './RoomFeaturesSmall';
import ComponentError from '../Error/ComponentError';
import Image from 'next/image';

const publicUrl = getPublicUrl();

interface SwiperPaginationProp {
  data: any;
  activeIndex: number;
  onClickPagination: (index: number) => void;
}

interface VenuInfoSwiperProp {
  data: Treelist<_ResidenceStayDetail>[];
  isMeetingLayout: boolean;
  roomInfoTemplateProps: RoomInfoTemplateProps | MeetingRoomInfoTemplateProps;
  onClickPaginationItem: (index: number) => void;
  showiconAndTextSection?: boolean;
  listingTextDataSectionTitle?: string;
  roomSizeLabel: string;
  roomCapacityLabel: string;
}

const SwiperPagination = ({ data, activeIndex, onClickPagination }: SwiperPaginationProp) => {
  try {
    return (
      <div className="my-[30px] flex items-center gap-x-[12px]">
        {data.map((item: any, index: number) => {
          const isActive = index == activeIndex;

          if (isActive) {
            return (
              <Image
                src={`${publicUrl}/icon_dot2.svg`}
                className="h-[15px] w-[15px]"
                width={15}
                height={15}
                key={index}
                alt="active_dot"
              />
            );
          } else {
            return (
              <div
                onClick={() => onClickPagination(index)}
                className="hover:cursor-pointer"
                key={index}
              >
                <Image
                  src={`${publicUrl}/icon_dot.svg`}
                  className="h-[7px] w-[7px]"
                  width={7}
                  height={7}
                  alt="inactive_dot"
                />
              </div>
            );
          }
        })}
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

const VenuInfoSwiper = forwardRef(
  (
    {
      data,
      isMeetingLayout,
      roomInfoTemplateProps,
      onClickPaginationItem,
      showiconAndTextSection = true,
      listingTextDataSectionTitle,
      roomSizeLabel,
      roomCapacityLabel,
    }: VenuInfoSwiperProp,
    ref
  ) => {
    try {
      const context = useSitecoreContext();
      const isPageEditing = context.sitecoreContext.pageState === LayoutServicePageState.Edit;
      const [activeIndex, setActiveIndex] = useState(0);
      const { t } = useI18n();

      return (
        <div>
          <div className="hidden lg:block">
            {data.length > 1 && (
              <SwiperPagination
                data={data}
                activeIndex={activeIndex}
                onClickPagination={(index: number) => {
                  // swiperRef.current && swiperRef.current.swiper.slideTo(index);
                  onClickPaginationItem(index);
                }}
              />
            )}
          </div>
          <Swiper
            ref={ref}
            slidesPerView={1}
            allowTouchMove={false}
            onActiveIndexChange={({ realIndex }) => {
              setActiveIndex(realIndex);
            }}
            centeredSlides={true}
            modules={[Pagination, Navigation]}
            className="carousel4 h-[100%]"
          >
            {data.map((item: Treelist<_ResidenceStayDetail | _VenueDetail>, index: number) => {
              return (
                <SwiperSlide key={index}>
                  <div className="flex justify-center lg:justify-start">
                    <div className="w-full">
                      <Typography variant="h2" font="Bellefair" extraStyles="mb-[30px]">
                        <ScText field={item.fields.RoomTitle} />
                      </Typography>

                      <div
                        className={`${isMeetingLayout ? 'grid gap-[40px] lg:grid-cols-2 lg:gap-0 lg:divide-x' : 'grid gap-y-[40px] lg:grid-cols-3 lg:gap-x-[20px]'}`}
                      >
                        {/* TODO: might needa to alter the following conditional statement after converting the data of MeetingLayoutTable to real data */}
                        {(isPageEditing ||
                          (!isMeetingLayout && item.fields.RoomSize.value) ||
                          isMeetingLayout) && (
                          <div className={`${isMeetingLayout && 'lg:pr-[20px]'}`}>
                            <div
                              className={`${isMeetingLayout ? 'mb-[15px]' : 'mb-[10px]'}  flex items-center gap-[5px]`}
                            >
                              <ScImage
                                field={roomInfoTemplateProps.fields.RoomSizeIcon}
                                className="mt-[-2px] h-[12px] w-[12px]"
                              />
                              <Typography variant="l1" fontWeight="bold">
                                {roomSizeLabel}
                              </Typography>
                            </div>

                            {!isMeetingLayout ? (
                              <>
                                <Typography variant="p">
                                  <ScText field={item.fields.RoomSize} />
                                </Typography>
                              </>
                            ) : (
                              <RichTextTypography isMeetingFloorplan={false}>
                                <ScRichText field={item.fields.RoomSize as RichTextField} />
                              </RichTextTypography>
                            )}
                          </div>
                        )}
                        {(isPageEditing ||
                          (!isMeetingLayout && item.fields.Capacity.value) ||
                          isMeetingLayout) && (
                          <div className={`${isMeetingLayout && 'lg:pl-[20px]'}`}>
                            <div
                              className={`${isMeetingLayout ? 'mb-[15px]' : 'mb-[10px]'}  flex items-center gap-[5px]`}
                            >
                              <ScImage
                                field={roomInfoTemplateProps.fields.CapacityIcon}
                                className="mt-[-2px] h-[12px] w-[12px]"
                              />
                              <Typography variant="l1" fontWeight="bold">
                                {roomCapacityLabel}
                              </Typography>
                            </div>

                            {!isMeetingLayout ? (
                              <Typography variant="p">
                                <ScText field={item.fields.Capacity} />
                              </Typography>
                            ) : (
                              <RichTextTypography isMeetingFloorplan={false}>
                                <ScRichText field={item.fields.Capacity as RichTextField} />
                              </RichTextTypography>
                            )}
                          </div>
                        )}
                        {(isPageEditing || item.fields.BedSize?.value) && (
                          <div className={`${isMeetingLayout ? 'hidden' : 'block'}`}>
                            <div className={`mb-[10px] flex items-center gap-[5px]`}>
                              <ScImage
                                field={roomInfoTemplateProps.fields.BedSizeIcon}
                                className="mt-[-2px] h-[12px] w-[12px]"
                              />
                              <Typography variant="l1" fontWeight="bold">
                                {t(DICTIONARY_CONSTANT.STAYS.BED_SIZE)}
                              </Typography>
                            </div>
                            <Typography variant="p">
                              <ScText field={item.fields.BedSize} />
                            </Typography>
                          </div>
                        )}
                        {(isPageEditing || item.fields.Bedrooms?.value) && (
                          <div className={`${isMeetingLayout ? 'hidden' : 'block'}`}>
                            <div className={`mb-[10px] flex items-center gap-[5px]`}>
                              <ScImage
                                field={roomInfoTemplateProps.fields.BedroomIcon}
                                className="mt-[-2px] h-[12px] w-[12px]"
                              />
                              <Typography variant="l1" fontWeight="bold">
                                {t(DICTIONARY_CONSTANT.STAYS.BEDROOM)}
                              </Typography>
                            </div>
                            <Typography variant="p">
                              <ScText field={item.fields.Bedrooms} />
                            </Typography>
                          </div>
                        )}
                        {(isPageEditing || item.fields.Bathrooms?.value) && (
                          <div className={`${isMeetingLayout ? 'hidden' : 'block'}`}>
                            <div className={`mb-[10px] flex items-center gap-[5px]`}>
                              <ScImage
                                field={roomInfoTemplateProps.fields.BathroomIcon}
                                className="mt-[-2px] h-[12px] w-[12px]"
                              />
                              <Typography variant="l1" fontWeight="bold">
                                {t(DICTIONARY_CONSTANT.STAYS.BATHROOM)}
                              </Typography>
                            </div>
                            <Typography variant="p">
                              <ScText field={item.fields.Bathrooms} />
                            </Typography>
                          </div>
                        )}
                        {(isPageEditing || item.fields.Floor?.value) && (
                          <div className={`${isMeetingLayout ? 'hidden' : 'block'}`}>
                            <div className={`mb-[10px] flex items-center gap-[5px]`}>
                              <ScImage
                                field={roomInfoTemplateProps.fields.FloorIcon}
                                className="mt-[-2px] h-[12px] w-[12px]"
                              />
                              <Typography variant="l1" fontWeight="bold">
                                {t(DICTIONARY_CONSTANT.STAYS.FLOOR)}
                              </Typography>
                            </div>
                            <Typography variant="p">
                              <ScText field={item.fields.Floor} />
                            </Typography>
                          </div>
                        )}
                      </div>
                      {isMeetingLayout ? (
                        <RoomFeaturesSmall
                          iconAndTextData={showiconAndTextSection && item.fields.FeatureList}
                          listingTextData={item.fields.FeatureList}
                          listingTextDataSectionTitle={listingTextDataSectionTitle}
                        />
                      ) : (
                        <RoomFeaturesSmall
                          iconAndTextData={showiconAndTextSection && item.fields.FeatureList}
                          listingTextData={item.fields.AmenitiesList}
                          listingTextDataSectionTitle={listingTextDataSectionTitle}
                        />
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      );
    } catch (err) {
      return <ComponentError error={err} />;
    }
  }
);

export default VenuInfoSwiper;
