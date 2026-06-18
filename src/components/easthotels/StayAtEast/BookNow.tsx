import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from '@/components/ui/sheet';
import Typography from '../Typography/Typography';
import DropDown from '../CustomTypes/Components/DropDown';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import { Field, withDatasourceCheck, Text as ScText } from '@sitecore-jss/sitecore-jss-nextjs';
import { DatePickerWithRange } from '../CustomTypes/Components/DatePicker';
import CloseButton from '../CustomTypes/Components/CloseButton';
import tailwindConfig from 'tailwind.config';
import { useWindowSize } from '@uidotdev/usehooks';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { useI18n } from 'next-localization';
import {
  PropertySiteConfigurationProp,
  SiteConfigurationProp,
} from '@/props/SiteConfigurationProp';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import CTAButton from '../Button/CTAButton';
import { SitecoreLanguageToSabreLanguageMapping } from '@/utilities/LanguageUtilities';
import ComponentError from '../Error/ComponentError';
import { useUrlForBookingRooms } from '@/hooks/useUrlForBookingRooms';
import type { TextField } from '@sitecore-jss/sitecore-jss-nextjs';
import useSabreSession from '@/hooks/useSabreSession';

const publicUrl = getPublicUrl();

const getReservationFormattedDate = (date: Date) => {
  const offset = date.getTimezoneOffset();
  date = new Date(date.getTime() - offset * 60 * 1000);
  return date.toISOString().split('T')[0];
};

const BookNow = ({
  siteConfigurationProp,
  isProperty = false,
  hotelId = {},
  roomCategory = {},
  children,
}: {
  siteConfigurationProp?: SiteConfigurationProp | PropertySiteConfigurationProp;
  isProperty?: boolean;
  hotelId?: TextField;
  roomCategory?: TextField;
  children?: React.ReactNode;
}) => {
  try {
    const { doSabreLogin } = useSabreSession();
    const windowSize = useWindowSize();
    const tailwindConfigLg = Number(tailwindConfig.theme?.extend?.screens?.lg.replace(/\D/g, ''));
    const { t, locale } = useI18n();

    const DESTINATION_DATA = !isProperty
      ? (
          siteConfigurationProp as SiteConfigurationProp
        ).fields?.BookNowConfiguration?.fields.BookNowHotels?.map((hotel, index) => {
          return {
            href: hotel.fields.HotelId.value,
            text: hotel.fields.Location.value,
            hotelId: hotel.fields.HotelId,
          };
        })
      : [];

    const [selectedDestination, setSelectedDestination] = useState(
      DESTINATION_DATA ? DESTINATION_DATA[0]?.text : ''
    );
    const [selectedHotelId, setSelectedHotelId] = !isProperty
      ? useState(DESTINATION_DATA ? DESTINATION_DATA[0]?.href : '')
      : useState(hotelId.value ? hotelId.value : '');
    // console.log(`selected hotel id `, selectedHotelId);

    useEffect(() => {
      if (hotelId.value) {
        setSelectedHotelId(hotelId.value);
      }
    }, [hotelId]);
    // const [selectedDepart, setSelectedDepart] = useState(
    //   addDays(new Date(), 1).toISOString().split('T')[0]
    // );
    // const [selectedArrive, setSelectedArrive] = useState(new Date().toISOString().split('T')[0]);

    // Todo: Alva to help check why the hotelid and roomcategory not able to pass into the url?
    // Can use this URL for testing: http://east.shg.local:3000/en/hongkong/rooms/urban-view
    // https://reservations.easthotels.com/?adult=1%2C1&arrive=2024-05-16&chain=28804&child=0%2C0&childages=%2C&currency=HKD&depart=2024-05-17&hotel=26885&level=hotel&locale=en-US&rooms=2&sbe_rc=ZGY2MjUxYjctOTdhZC00NDc5LWIwMzItODM4ZDQ5YTg4YjcyLDZjZTJmNzAzLWJiZTYtNDkwMC1hMWVkLTc2N2M4MDliMWI2Mw%3D%3D
    // https://reservations.easthotels.com/?adult=1%2C1&arrive=2024-05-16&chain=28804&child=0%2C0&childages=%2C&currency=HKD&depart=2024-05-17&hotel=26885&level=hotel&locale=en-US&rooms=2&sbe_rc=ZGY2MjUxYjctOTdhZC00NDc5LWIwMzItODM4ZDQ5YTg4YjcyLDZjZTJmNzAzLWJiZTYtNDkwMC1hMWVkLTc2N2M4MDliMWI2Mw%3D%3D
    const {
      url,
      adultNum,
      childrenNum,
      setSelectedArrive,
      setSelectedDepart,
      setAdultNum,
      setChildrenNum,
      setPromoCode,
    } = useUrlForBookingRooms({
      selectedHotelId,
      defaultRoomCategory: roomCategory.value ? roomCategory.value : '',
    });

    return (
      <Sheet>
        <SheetTrigger
          asChild
          style={{
            WebkitAppearance: 'none',
          }}
        >
          {children ? (
            <div className="hover:cursor-pointer">{children}</div>
          ) : (
            <div className="hover:cursor-pointer">
              <CTAButton
                disabled
                text={t(DICTIONARY_CONSTANT.RESERVATIONS.BOOK_NOW)?.toUpperCase() || ''}
                url={url}
                variant="contained-small"
                fontColor="white"
                bgColor="green-primary"
                isNewWindow={true}
                extraContainerStyles="flex lg:min-w-[106px] min-w-[96px] min-h-[34px]"
                extraStyles="!mb-0"
              />
            </div>
          )}
        </SheetTrigger>
        <SheetContent>
          <SheetHeader className="mb-10">
            <SheetClose asChild>
              <div className="mb-10 flex justify-end">
                <CloseButton />
              </div>
            </SheetClose>
            <SheetTitle>
              {isProperty ? (
                <>
                  <Typography variant="h4" extraStyles="text-[20px] text-left whitespace-pre-wrap">
                    <ScText field={siteConfigurationProp?.fields.SideReservationLabel} />
                  </Typography>
                  <Typography
                    variant="h4"
                    extraStyles="text-[20px] text-left whitespace-pre-wrap"
                    fontWeight="semiBold"
                  >
                    <ScText field={siteConfigurationProp?.fields.SideReservationPropertyLabel} />
                  </Typography>
                </>
              ) : (
                <Typography
                  variant="h4"
                  extraStyles="text-[20px] text-left text-black-secondary whitespace-pre-wrap"
                >
                  {siteConfigurationProp ? (
                    <ScText field={siteConfigurationProp.fields.ReservationLabel} />
                  ) : (
                    ''
                  )}
                </Typography>
              )}
            </SheetTitle>
          </SheetHeader>

          {!isProperty && (
            <div className="mb-10 hover:cursor-pointer">
              <DropDown
                dropdownItems={DESTINATION_DATA}
                isDemo
                onItemSelected={(name) => {
                  setSelectedDestination(name);
                  setSelectedHotelId(DESTINATION_DATA.filter((x) => x.text == name)[0]?.href);
                }}
              >
                <div className="inline-flex flex-row items-center">
                  <Typography variant="l1">
                    {t(DICTIONARY_CONSTANT.RESERVATIONS.DESTINATION)}
                  </Typography>
                  <img
                    src={`${publicUrl}/icon_header_arrow.svg`}
                    alt="arrow_down_black"
                    className="mt-[-4px] pl-[5px]"
                  />
                </div>
              </DropDown>

              <div className="mt-2.5 w-full border-b-2 pb-[5px]">
                <Typography variant="p" extraStyles="text-black-secondary">
                  {selectedDestination}
                </Typography>
              </div>
            </div>
          )}

          <div className="mb-10 grid gap-2">
            <DatePickerWithRange
              textColor="#1d2021"
              icon={'icon_header_arrow_black.svg'}
              underline
              calendarType={
                windowSize.width && windowSize.width >= tailwindConfigLg ? 'default' : 'mobile'
              }
              onDatePickerSelected={(dateRange: DateRange) => {
                dateRange.from && setSelectedArrive(getReservationFormattedDate(dateRange.from));
                dateRange.to && setSelectedDepart(getReservationFormattedDate(dateRange.to));
              }}
            />
          </div>

          <div className="mb-10 grid grid-cols-2 gap-5">
            {/* <div className="mr-[25px] border-b-2"> */}
            <div className="border-b-2">
              <Typography variant="l1" extraStyles="mb-[10px]" fontWeight="bold">
                {t(DICTIONARY_CONSTANT.RESERVATIONS.ADULTS)}
              </Typography>
              <div className="flex flex-row justify-between">
                <Typography
                  variant="p"
                  extraStyles="text-orange-primary hover:cursor-pointer w-5 select-none"
                  onClick={() => {
                    adultNum > 1 && setAdultNum(adultNum - 1);
                  }}
                >
                  -
                </Typography>
                <Typography variant="p">{adultNum.toString()}</Typography>
                <Typography
                  variant="p"
                  extraStyles="text-orange-primary hover:cursor-pointer w-5 text-right select-none"
                  onClick={() => {
                    setAdultNum(adultNum + 1);
                  }}
                >
                  +
                </Typography>
              </div>
            </div>
            <div className="border-b-2">
              <Typography variant="l1" extraStyles="mb-[10px]" fontWeight="bold">
                {t(DICTIONARY_CONSTANT.RESERVATIONS.CHILDREN)}
              </Typography>
              <div className="flex flex-row justify-between">
                <Typography
                  variant="p"
                  extraStyles="text-orange-primary hover:cursor-pointer w-5 select-none"
                  onClick={() => {
                    childrenNum > 0 && setChildrenNum(childrenNum - 1);
                  }}
                >
                  -
                </Typography>
                <Typography variant="p">{childrenNum.toString()}</Typography>
                <Typography
                  variant="p"
                  extraStyles="text-orange-primary hover:cursor-pointer w-5 text-right select-none"
                  onClick={() => {
                    setChildrenNum(childrenNum + 1);
                  }}
                >
                  +
                </Typography>
              </div>
            </div>
          </div>

          <div className="mb-10 border-b-2">
            <Typography variant="l1" extraStyles="mb-[5px]" fontWeight="bold">
              {t(DICTIONARY_CONSTANT.RESERVATIONS.PROMO_CODE)}
            </Typography>
            <input
              type="text"
              placeholder={t(DICTIONARY_CONSTANT.RESERVATIONS.PROMO_CODE_PLACEHOLDER)}
              onChange={(event) => {
                setPromoCode(event.target.value);
              }}
              className="w-full border-none font-[Amiko] text-[13px] text-black-secondary placeholder-gray-500 placeholder-opacity-30 focus:outline-none"
            />
          </div>

          <SheetFooter>
            <SheetClose asChild>
              <button
                className="flex w-full items-center justify-center bg-green-primary py-[10px]"
                onClick={() => {
                  console.log(`book now url: ${url}`);
                  // window.open(url, '_blank');
                  doSabreLogin(url, selectedHotelId, '_blank');
                }}
              >
                <Typography variant="l3" fontColor={'white'} extraStyles="mt-[5px]">
                  {t(DICTIONARY_CONSTANT.RESERVATIONS.BOOK_NOW)}
                </Typography>
              </button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default BookNow;
