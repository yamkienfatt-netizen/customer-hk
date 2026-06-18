import { withDatasourceCheck, Text as ScText } from '@sitecore-jss/sitecore-jss-nextjs';
import React, { useState } from 'react';
import CTAButton from '../Button/CTAButton';
import Typography from '../Typography/Typography';
import { DatePickerWithRange } from '../CustomTypes/Components/DatePicker';
import { useI18n } from 'next-localization';
import {
  PropertySiteConfigurationProp,
  SiteConfigurationProp,
} from '@/props/SiteConfigurationProp';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import { addDays } from 'date-fns';
import { GetReservationFormattedDate } from '@/utilities/ReservationUtilities';
import { DateRange } from 'react-day-picker';
import { useWindowSize } from '@uidotdev/usehooks';
import tailwindConfig from 'tailwind.config';
import { SitecoreLanguageToSabreLanguageMapping } from '@/utilities/LanguageUtilities';
import ComponentError from '../Error/ComponentError';

const Default = (propertySiteConfigurationProps: PropertySiteConfigurationProp) => {
  try {
    const { t, locale } = useI18n();
    const adult = 1;
    const child = 0;
    const selectedHotelId =
      propertySiteConfigurationProps.fields.PropertyBookNowConfiguration?.fields.HotelId.value;
    const [selectedArrive, setSelectedArrive] = useState(new Date().toISOString().split('T')[0]);
    const [selectedDepart, setSelectedDepart] = useState(
      addDays(new Date(), 1).toISOString().split('T')[0]
    );

    const url = `https://reservations.easthotels.com/?adult=${adult}&arrive=${selectedArrive}&child=${child}&depart=${selectedDepart}&hotel=${selectedHotelId}&locale=${SitecoreLanguageToSabreLanguageMapping[locale()]}`;
    const windowSize = useWindowSize();
    const tailwindConfigLg = Number(tailwindConfig.theme?.extend?.screens?.lg.replace(/\D/g, ''));
    return (
      <div className="flex h-full flex-col justify-between bg-green-primary px-[15px] py-[30px] lg:flex-row lg:px-[30px] lg:py-[23px] lg:opacity-90">
        <div className="flex items-center lg:flex-auto">
          <Typography variant="h3" font="Bellefair" fontColor="white">
            <ScText field={propertySiteConfigurationProps.fields.ReservationLabel} />
          </Typography>
        </div>

        <div className="my-[30px] lg:my-0 lg:flex-auto">
          <DatePickerWithRange
            textColor={'#fff'}
            underline={false}
            calendarType={
              windowSize.width && windowSize.width >= tailwindConfigLg ? 'default' : 'mobile'
            }
            onDatePickerSelected={(dateRange: DateRange) => {
              dateRange.from && setSelectedArrive(GetReservationFormattedDate(dateRange.from));
              dateRange.to && setSelectedDepart(GetReservationFormattedDate(dateRange.to));
            }}
          ></DatePickerWithRange>
        </div>

        <div className="lg:flex lg:items-center">
          <CTAButton
            text={t(DICTIONARY_CONSTANT.RESERVATIONS.BOOK_NOW)}
            url={url}
            variant="contained-small"
            fontColor="#828077"
            bgColor="white"
            isNewWindow={true}
            extraContainerStyles="min-w-[190px] min-h-[40px]"
          />
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />
  }
};

export default withDatasourceCheck()<PropertySiteConfigurationProp>(Default);
