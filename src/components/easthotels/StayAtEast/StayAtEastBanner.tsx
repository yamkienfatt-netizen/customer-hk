import React, { useState } from 'react';
import { BrandHomePageHeroBannerProps } from '@/props/Media/BrandHomePageHeroBannersProps';
import { Field, withDatasourceCheck, Text as ScText } from '@sitecore-jss/sitecore-jss-nextjs';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import CTAButton from 'components/easthotels/Button/CTAButton';
import { DatePickerWithRange } from '../CustomTypes/Components/DatePicker';
import DropDown from 'components/easthotels/CustomTypes/Components/DropDown';
import Typography from 'components/easthotels/Typography/Typography';
import { ComponentProps } from 'lib/component-props';
import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import { SiteConfigurationProp } from '@/props/SiteConfigurationProp';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { GetReservationFormattedDate } from '@/utilities/ReservationUtilities';
import { useWindowSize } from '@uidotdev/usehooks';
import tailwindConfig from 'tailwind.config';
import { SitecoreLanguageToSabreLanguageMapping } from '@/utilities/LanguageUtilities';
import ComponentError from '../Error/ComponentError';
import Image from 'next/image';

const publicUrl = getPublicUrl();

const Default = (siteConfigurationProp: SiteConfigurationProp) => {
  try {
    // test adding params to button
    const { t, locale } = useI18n();
    const adult = 1;
    const child = 0;

    const DESTINATION_DATA =
      siteConfigurationProp?.fields?.BookNowConfiguration?.fields.BookNowHotels?.map(
        (hotel, index) => {
          return { href: hotel.fields.HotelId.value, text: hotel.fields.Location.value };
        }
      );

    const [selectedDestination, setSelectedDestination] = useState(
      DESTINATION_DATA ? DESTINATION_DATA[0]?.text : ''
    );
    const [selectedHotelId, setSelectedHotelId] = useState(
      DESTINATION_DATA ? DESTINATION_DATA[0]?.href : ''
    );

    const [selectedArrive, setSelectedArrive] = useState(new Date().toISOString().split('T')[0]);
    const [selectedDepart, setSelectedDepart] = useState(
      addDays(new Date(), 1).toISOString().split('T')[0]
    );

    const url = `https://reservations.easthotels.com/?adult=${adult}&arrive=${selectedArrive}&child=${child}&depart=${selectedDepart}&hotel=${selectedHotelId}&locale=${SitecoreLanguageToSabreLanguageMapping[locale()]}`;
    const windowSize = useWindowSize();
    const tailwindConfigLg = Number(tailwindConfig.theme?.extend?.screens?.lg.replace(/\D/g, ''));
    return (
      <>
        <div className="flex h-full flex-col justify-between bg-green-primary px-[15px] py-[30px] lg:flex-row lg:px-[30px] lg:py-[17px] lg:opacity-90">
          <Typography
            variant="h3"
            font="Bellefair"
            fontColor="white"
            extraStyles="flex items-center mb-[30px] lg:mb-0"
          >
            <ScText field={siteConfigurationProp.fields.ReservationLabel} />
          </Typography>
          <div className="mb-[25px] lg:mb-0 lg:flex lg:flex-1 lg:justify-center">
            <div>
              <DropDown
                dropdownItems={DESTINATION_DATA}
                isDemo
                onItemSelected={(name) => {
                  setSelectedDestination(name);
                  setSelectedHotelId(DESTINATION_DATA.filter((x) => x.text == name)[0]?.href);
                }}
              >
                <div className="mb-[10px] inline-flex hover:cursor-pointer lg:flex">
                  <Typography
                    variant="l1"
                    fontColor="white"
                    fontWeight="bold"
                    extraStyles="lg:font-semibold"
                  >
                    {t(DICTIONARY_CONSTANT.RESERVATIONS.DESTINATION)}
                  </Typography>
                  <Image
                    src={`${publicUrl}/icon_arrow_down_w.svg`}
                    alt="location"
                    className="mt-[-4px] pl-[5px]"
                    width={11}
                    height={22}
                  />
                </div>
              </DropDown>
              <Typography variant="p" fontColor="white" extraStyles="">
                {selectedDestination}
              </Typography>
            </div>
          </div>
          <div className="mb-[30px] lg:mb-0 lg:flex-1">
            <DatePickerWithRange
              checkInOutExtraStyles="lg:font-semibold"
              onDatePickerSelected={(dateRange: DateRange) => {
                dateRange.from && setSelectedArrive(GetReservationFormattedDate(dateRange.from));
                dateRange.to && setSelectedDepart(GetReservationFormattedDate(dateRange.to));
              }}
              textColor={'#fff'}
              underline={false}
              calendarType={
                windowSize.width && windowSize.width >= tailwindConfigLg ? 'default' : 'mobile'
              }
            ></DatePickerWithRange>
          </div>
          <div>
            <CTAButton
              text={t(DICTIONARY_CONSTANT.RESERVATIONS.BOOK_NOW)}
              url={url}
              variant="contained-small"
              fontColor="#828077"
              bgColor="white"
              isNewWindow={true}
              extraContainerStyles={'min-w-[190px] min-h-[40px]'}
            />
          </div>
        </div>
      </>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default withDatasourceCheck()<SiteConfigurationProp>(Default);
