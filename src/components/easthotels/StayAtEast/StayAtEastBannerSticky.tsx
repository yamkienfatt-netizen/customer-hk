import React, { useState } from 'react';
import { Text as ScText } from '@sitecore-jss/sitecore-jss-nextjs';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import CTAButton from 'components/easthotels/Button/CTAButton';
import { DatePickerWithRange } from '../CustomTypes/Components/DatePicker';
import Typography from 'components/easthotels/Typography/Typography';
import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import { BookNowHotel } from '@/props/Location/ReservationProp';
import { addDays } from 'date-fns';
import { PropertySiteConfigurationProp } from '@/props/SiteConfigurationProp';
import { SitecoreLanguageToSabreLanguageMapping } from '@/utilities/LanguageUtilities';
import { GetReservationFormattedDate } from '@/utilities/ReservationUtilities';
import { DateRange } from 'react-day-picker';
import ComponentError from '../Error/ComponentError';
import { useUrlForBookingRooms } from '@/hooks/useUrlForBookingRooms';

export const StayAtEastBannerSticky = ({
  propertySiteConfiguration,
}: {
  propertySiteConfiguration: PropertySiteConfigurationProp;
}) => {
  try {
    // test adding params to button
    const { t } = useI18n();

    const { url, setSelectedArrive, setSelectedDepart } = useUrlForBookingRooms({
      selectedHotelId:
        propertySiteConfiguration?.fields.PropertyBookNowConfiguration?.fields.HotelId.value,
    });

    return (
      <>
        <div className="flex h-full flex-col justify-between bg-green-primary px-[15px] py-[30px]  lg:flex-row lg:px-[30px] lg:py-[17px] lg:opacity-90">
          <Typography
            variant="h3"
            font="Bellefair"
            fontColor="white"
            extraStyles="flex items-center basis-1/2"
          >
            <ScText field={propertySiteConfiguration?.fields.ReservationLabel} />
          </Typography>
          <div className="flex basis-1/2 justify-between">
            <DatePickerWithRange
              className={'basis-2/3'}
              onDatePickerSelected={(dateRange: DateRange) => {
                dateRange.from && setSelectedArrive(GetReservationFormattedDate(dateRange.from));
                dateRange.to && setSelectedDepart(GetReservationFormattedDate(dateRange.to));
              }}
            ></DatePickerWithRange>
            <CTAButton
              text={t(DICTIONARY_CONSTANT.RESERVATIONS.BOOK_NOW)}
              url={url}
              variant="contained-small"
              fontColor="#828077"
              bgColor="white"
              isNewWindow={true}
              extraContainerStyles="min-w-[190px] min-h-[40px] basis-1/3"
            />
          </div>
        </div>
        <div className="lg:h-5" />
      </>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};
