import React from 'react';
import Typography from '../Typography/Typography';
import BookNow from '../StayAtEast/BookNow';
import { FloorPlanLightBox } from './FloorPlanLightBox';
import { _StayDetail } from '@/props/common/_StayDetail';
import { Text as ScText } from '@sitecore-jss/sitecore-jss-nextjs';
import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import CTAButton from '../Button/CTAButton';
import ComponentError from '../Error/ComponentError';

const StayDetailSideMenu = (stayDetail: _StayDetail) => {
  try {
    const { t } = useI18n();
    return (
      <div>
        <div className="mb-[25px] grid grid-cols-2">
          <div>
            <Typography variant="l1" fontWeight="bold" extraStyles="mb-[10px]">
              {t(DICTIONARY_CONSTANT.STAYS.ROOM_TYPE)}
            </Typography>
            <Typography variant="p">
              <ScText field={stayDetail.RoomType} />
            </Typography>
          </div>
          <div>
            <Typography variant="l1" fontWeight="bold" extraStyles="mb-[10px]">
              {t(DICTIONARY_CONSTANT.STAYS.ROOM_SIZE)}
            </Typography>
            <Typography variant="p">
              <ScText field={stayDetail.RoomSize} />
            </Typography>
          </div>
        </div>
        <div className="mb-[40px] grid grid-cols-2 lg:mb-[48px]">
          <div>
            <Typography variant="l1" fontWeight="bold" extraStyles="mb-[10px]">
              {t(DICTIONARY_CONSTANT.STAYS.ROOM_VIEW)}
            </Typography>
            <Typography variant="p">
              <ScText field={stayDetail.RoomView} editable={true} />
            </Typography>
          </div>
          <div>
            <Typography variant="l1" fontWeight="bold" extraStyles="mb-[10px]">
              {t(DICTIONARY_CONSTANT.STAYS.BED_SIZE)}
            </Typography>
            <Typography variant="p">
              <ScText field={stayDetail.BedSize} />
            </Typography>
          </div>
        </div>

        <div className="mb-[32px] flex">
          <FloorPlanLightBox floorplanImage={stayDetail.FloorPlan}>
            <CTAButton
              disabled
              text={t(DICTIONARY_CONSTANT.STAYS.FLOOR_PLAN)}
              variant={'underlined'}
              extraContainerStyles="mr-[20px]"
            />
          </FloorPlanLightBox>

          {stayDetail?.VirtualTourLink?.value?.href &&
            stayDetail?.VirtualTourLink?.value?.href !== 'http://' && (
              <CTAButton
                url={stayDetail?.VirtualTourLink}
                text={t(DICTIONARY_CONSTANT.STAYS.VIRTUAL_TOUR)}
                variant={'underlined'}
              />
            )}
        </div>

        {/* ToWen: BookNow needs siteConfigurationProp and hotelId when convert to sitecore component thankss*/}
        <BookNow isProperty hotelId={stayDetail?.HotelId} roomCategory={stayDetail?.RoomCategory}>
          <CTAButton
            disabled
            text={t(DICTIONARY_CONSTANT.RESERVATIONS.BOOK_NOW)}
            variant="contained-big"
            fontColor="white"
            bgColor="green-primary"
            isNewWindow={true}
            extraContainerStyles="hidden min-h-[50px] min-w-[375px] lg:flex lg:min-h-[40px] lg:min-w-[300px]"
          />
        </BookNow>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default StayDetailSideMenu;
