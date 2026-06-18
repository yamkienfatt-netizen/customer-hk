import React, { useState, useRef, useEffect } from 'react';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import FloorPlanSwiper from './FloorPlanSwiper';
import CTAButton from '../Button/CTAButton';
import RoomFeaturesSmall from './RoomFeaturesSmall';
import VenuInfoSwiper from './VenuInfoSwiper';
import {
  LinkField,
  TextField,
  useSitecoreContext,
  withDatasourceCheck,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { RoomInfoTemplateProps } from '@/props/PageContent/RoomInfoTemplateProps';
import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import { PageRouteFields } from '@/props/Core/PageProps';
import { _ResidenceStayDetail } from '@/props/common/_ResidenceStayDetail';
import ComponentError from '../Error/ComponentError';

const Default = (roomInfoTemplateProps: RoomInfoTemplateProps) => {
  try {
    const context = useSitecoreContext();
    const { route } = context.sitecoreContext;

    const pageFields = route?.fields as PageRouteFields & _ResidenceStayDetail;

    const { t } = useI18n();
    const floorplanSwiperRef = useRef(null);
    const venuInfoSwiperRef = useRef(null);

    const sitecoreCss = roomInfoTemplateProps.params?.Styles ?? ''; // use this after converted
    return (
      <div className={'medium-section-container lg:!max-w-[1440px]' + sitecoreCss}>
        <div className="mx-[15px] lg:mx-[50px]">
          <div className="lg:grid lg:grid-cols-2 lg:gap-[50px]">
            <div className="">
              <div className="flex flex-col lg:sticky lg:top-[80px]">
                <FloorPlanSwiper
                  ref={floorplanSwiperRef}
                  data={roomInfoTemplateProps.fields.SelectedRoomInfo}
                  swiperMaxWidth={590}
                  onClickPaginationItem={(index: number) => {
                    floorplanSwiperRef.current && floorplanSwiperRef.current.swiper.slideTo(index);
                    venuInfoSwiperRef.current && venuInfoSwiperRef.current.swiper.slideTo(index);
                  }}
                />
                <div className="hidden justify-center lg:flex">
                  <div className="mt-[52px] h-full max-h-[40px] w-full max-w-[300px]">
                    <CTAButton
                      variant="contained-big"
                      url={roomInfoTemplateProps.fields.EnquiryCTALink as LinkField}
                      text={roomInfoTemplateProps.fields.EnquiryCTAText as TextField}
                      fontColor="white"
                      bgColor="green-primary"
                    ></CTAButton>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="hidden justify-end lg:flex">
                {roomInfoTemplateProps?.fields?.BrochureCTALink?.value?.href && (
                  <CTAButton
                    variant="underlined"
                    url={roomInfoTemplateProps.fields.BrochureCTALink as LinkField}
                    text={roomInfoTemplateProps.fields.BrochureCTAText as TextField}
                  ></CTAButton>
                )}
              </div>
              <VenuInfoSwiper
                ref={venuInfoSwiperRef}
                data={roomInfoTemplateProps.fields.SelectedRoomInfo}
                isMeetingLayout={false}
                roomSizeLabel={t(DICTIONARY_CONSTANT.STAYS.ROOM_SIZE)}
                roomCapacityLabel={t(DICTIONARY_CONSTANT.STAYS.CAPACITY)}
                roomInfoTemplateProps={roomInfoTemplateProps}
                onClickPaginationItem={(index: number) => {
                  venuInfoSwiperRef.current && venuInfoSwiperRef.current.swiper.slideTo(index);
                  floorplanSwiperRef.current && floorplanSwiperRef.current.swiper.slideTo(index);
                }}
              />
              <div className="mt-[50px] flex justify-center lg:hidden">
                {roomInfoTemplateProps?.fields?.BrochureCTALink?.value?.href && (
                  <CTAButton
                    variant="underlined"
                    url={roomInfoTemplateProps.fields.BrochureCTALink as LinkField}
                    text={roomInfoTemplateProps.fields.BrochureCTAText as TextField}
                  ></CTAButton>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default withDatasourceCheck()<RoomInfoTemplateProps>(Default);
