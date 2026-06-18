import React, { useState, useRef, useEffect } from 'react';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import Typography from '../Typography/Typography';
import FloorPlanSwiper from './FloorPlanSwiper';
import CTAButton from '../Button/CTAButton';
import RoomFeaturesSmall from './RoomFeaturesSmall';
import VenuInfoSwiper from './VenuInfoSwiper';
import { TableLightBox } from '../CustomTypes/Components/TableLightBox';
import { MeetingRoomInfoTemplateProps } from '@/props/PageContent/MeetingRoomInfoTemplateProps';
import { LinkField, TextField, withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import { useI18n } from 'next-localization';
import ComponentError from '../Error/ComponentError';


const Default = (meetingRoomInfoTemplateProps: MeetingRoomInfoTemplateProps) => {
  try {
    const { t } = useI18n();

    const floorplanSwiperRef = useRef(null);
    const venuInfoSwiperRef = useRef(null);

    const [fullUrl, setFullUrl] = useState('');

    useEffect(() => {
      if (typeof window !== 'undefined') {
        const url = window.location.href;
        setFullUrl(url);
        console.log('url', url);
      }
    }, []);
    const sitecoreCss = meetingRoomInfoTemplateProps.params?.Styles ?? ''; // use this after converted to sitecore

    return (
      <div className={'medium-section-container ' + sitecoreCss}>
        <div className="mx-[15px] lg:mx-[50px]">
          <div className="lg:grid lg:grid-cols-2 lg:gap-[50px]">
            <div>
              <div className="flex flex-col lg:sticky lg:top-[80px]">
                <FloorPlanSwiper
                  ref={floorplanSwiperRef}
                  data={meetingRoomInfoTemplateProps.fields.SelectedMeetingRoomInfo}
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
                      url={meetingRoomInfoTemplateProps.fields.EnquiryCTALink as LinkField}
                      text={meetingRoomInfoTemplateProps.fields.EnquiryCTAText as TextField}
                      bgColor="green-primary"
                      fontColor="white"
                    ></CTAButton>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="hidden justify-end gap-[20px] lg:flex">
                {meetingRoomInfoTemplateProps?.fields?.CompareVenue?.value && (
                  <TableLightBox table={meetingRoomInfoTemplateProps.fields.CompareVenue}>
                    <div className="hover:cursor-pointer">
                      <CTAButton
                        disabled
                        text={t(DICTIONARY_CONSTANT.CTA.VENUE_DETAIL_COMPARE)}
                        url={'/'}
                        variant="underlined"
                      />
                    </div>
                  </TableLightBox>
                )}
                {meetingRoomInfoTemplateProps.fields.BrochureCTALink?.value?.href && (
                  <CTAButton
                    variant="underlined"
                    url={meetingRoomInfoTemplateProps.fields.BrochureCTALink as LinkField}
                    text={meetingRoomInfoTemplateProps.fields.BrochureCTAText as TextField}
                  ></CTAButton>
                )}
              </div>
              <VenuInfoSwiper
                ref={venuInfoSwiperRef}
                data={meetingRoomInfoTemplateProps.fields.SelectedMeetingRoomInfo}
                isMeetingLayout={true}
                roomInfoTemplateProps={meetingRoomInfoTemplateProps}
                onClickPaginationItem={(index: number) => {
                  venuInfoSwiperRef.current && venuInfoSwiperRef.current.swiper.slideTo(index);
                  floorplanSwiperRef.current && floorplanSwiperRef.current.swiper.slideTo(index);
                }}
                listingTextData={
                  meetingRoomInfoTemplateProps.fields.SelectedMeetingRoomInfo[0]?.fields.AmenitiesList
                }
                listingTextDataSectionTitle={t(DICTIONARY_CONSTANT.STAYS.MEETING_EVENT_FEATURES)}
                showiconAndTextSection={false}
                roomSizeLabel={t(DICTIONARY_CONSTANT.STAYS.MEETING_EVENT_SIZE)}
                roomCapacityLabel={t(DICTIONARY_CONSTANT.STAYS.MEETING_EVENT_CAPACITY)}
              />
              {/* <RoomFeaturesSmall
                listingTextData={
                  meetingRoomInfoTemplateProps.fields.SelectedMeetingRoomInfo[0]?.fields.AmenitiesList
                }
                listingTextDataSectionTitle={t(DICTIONARY_CONSTANT.STAYS.AMENITIES)}
              /> */}
              <div className="mt-[50px] flex justify-center gap-[20px] lg:hidden">
                {meetingRoomInfoTemplateProps?.fields?.CompareVenue?.value && (
                  <TableLightBox table={meetingRoomInfoTemplateProps.fields.CompareVenue}>
                    <div className="hover:cursor-pointer">
                      <CTAButton
                        disabled
                        text={t(DICTIONARY_CONSTANT.CTA.VENUE_DETAIL_COMPARE)}
                        url={'/'}
                        variant="underlined"
                      />
                    </div>
                  </TableLightBox>
                )}
                {meetingRoomInfoTemplateProps.fields.BrochureCTALink?.value?.href && (
                  <CTAButton
                    variant="underlined"
                    url={meetingRoomInfoTemplateProps.fields.BrochureCTALink as LinkField}
                    text={meetingRoomInfoTemplateProps.fields.BrochureCTAText as TextField}
                  ></CTAButton>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />
  }
};

export default withDatasourceCheck()<MeetingRoomInfoTemplateProps>(Default);
