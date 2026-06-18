import { Field, Image, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';
import React, { useEffect, useState } from 'react';
import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import { RoomImagesField, RoomImagesProps } from '@/props/Graphql/RoomImagesQueryProps';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import Typography from '../Typography/Typography';
import { StatusList } from '@/utilities/SsoConstant';

interface UpcomingBooking {
  SectionName: Field<string>;
  SectionItem: Array<RoomItem>;
}
interface RoomItem {
  fields: Room;
}
interface Room {
  Image: ImageField;
  RoomId: Field<string>;
  CheckInDate: Date;
  CheckOutDate: Date;
  Night: Field<string>;
  NumberOfGuest: Field<string>;
  Hotel: Field<string>;
  RoomType: Field<string>;
  Status: Field<string>;
}

interface bookingDetails {
  BookingReference?: string | null;
  HotelId?: string | null;
  CheckInDate?: string | null;
  CheckOutDate?: string | null;
  Nights?: number | null;
  NumberOfGuests?: number | null;
  Status?: string | null;
  RoomType?: string | null;
  Image?: ImageField | null;
}

const publicUrl = getPublicUrl();

const UpcomingBooking = () => {
  const { t, locale } = useI18n();
  const [hasBooking, setGetUpcomingBooking] = useState(false);
  const bookingArr: bookingDetails[] = [];
  //const _bookingArr: bookingDetailsData[] = [];
  const [upcomingBookingDetail, setUpcomingBookingDetail] = useState(bookingArr);
  //const [_upcomingBookingDetail, _setUpcomingBookingDetail] = useState(_bookingArr);

  //const err_msg = t(DICTIONARY_CONSTANT.SSO.Global.INVALID_API);

  // const findValue = (matches: RoomImagesField[], key?: string) => {
  //   if (key == null) {
  //     return '';
  //   }
  //   for (const match of matches) {
  //     if (match.Key.jsonValue.value === key) {
  //       return match.Value.jsonValue.value;
  //     }
  //   }
  //   return key;
  // };

  // const findImage = (matches: RoomImagesField[], key?: string) => {
  //   if (key == null) {
  //     return null;
  //   }
  //   for (const match of matches) {
  //     if (match.Key.jsonValue.value === key) {
  //       return match.Image.jsonValue;
  //     }
  //   }
  //   return null;
  // };

  useEffect(() => {
    (async () => {
      if (!hasBooking) {
        try {
          const origin = publicUrl;
          const response = await fetch(`${origin}/api/booking/getUpcomingBooking`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (response.status == 200) {
            const data = (await response.json()) as bookingDetails[];
            data.forEach((item) => {
              if (item.HotelId != undefined && item.RoomType != undefined) {
                try {
                  async () => {
                    const roomData = await fetch(
                      `${origin}/api/booking/getRoomImage?HotelId=${item.HotelId}&RoomType=${item.RoomType}&Locale=${locale()}`,
                      {
                        method: 'GET',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                      }
                    );
                    if (roomData.status == 200) {
                      const rdata = (await roomData.json()) as RoomImagesProps;
                      item.Image = rdata.RoomImage;
                      item.HotelId = rdata.HotelName;
                      item.RoomType = rdata.RoomType;
                    }
                  };
                } catch (error) {
                  console.error('Error fetching data:', error);
                }
              }
              if (item.Status != undefined) {
                const statusLabel = StatusList.find((x) => x.code == item.Status)?.label;
                if (statusLabel != undefined) {
                  item.Status = t(statusLabel);
                }
              }
            });
            setUpcomingBookingDetail(data);
          }
          // else if (response.status == 401) {
          //   toLogin();
          // }
          else {
            console.log('no data');
            //alert(err_msg);
            return;
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          //alert(err_msg);
          return;
        }

        setGetUpcomingBooking(true);
      }
    })();
  }, []);

  return (
    <div className="w-full sm:py-10">
      <div className="mb-10 font-[Bellefair] text-[40px] uppercase leading-[40px] sm:text-[50px] sm:leading-[50px] ">
        {t(DICTIONARY_CONSTANT.SSO.Global.UPCOMING_BOOKING)}
      </div>
      {upcomingBookingDetail.map((booking, index) => (
        <React.Fragment key={index}>
          <div className="my-5 border border-t-[#d7d6d5] sm:block"></div>
          <div className="sm:grid sm:grid-cols-2 sm:gap-[30px]">
            <div className="max-w-[450px] pb-10">
              {booking.Image != null ? (
                <Image className="mx-auto" field={booking.Image} />
              ) : (
                <></>
                // <img
                //   className="mx-auto"
                //   src="https://xmc-swirehotels1-swirehotels-uat.sitecorecloud.io/-/media/Project/EAST-Hotels//HongKong/Done---Rooms/DONE---Urban-View-Suite/Urban-View-Suite.jpg"
                //   alt="Urban View Room"
                // />
              )}
            </div>
            <div>
              <div className="label pb-5 text-[20px] leading-[18px]">
                #{booking.BookingReference}
              </div>
              <div className="flex gap-10 py-3">
                <div>
                  <Typography variant="sso_track" fontWeight="bold" className="label pb-2">
                    {t(DICTIONARY_CONSTANT.SSO.Global.CHECK_IN_DATE)}
                  </Typography>
                  <Typography variant="l2">
                    {booking.CheckInDate?.split('/')[2]}-{booking.CheckInDate?.split('/')[1]}-
                    {booking.CheckInDate?.split('/')[0]}
                  </Typography>
                </div>
                <div>
                  <Typography variant="sso_track" fontWeight="bold" className="label pb-2 ">
                    {t(DICTIONARY_CONSTANT.SSO.Global.CHECK_OUT_DATE)}
                  </Typography>
                  <Typography variant="l2">
                    {booking.CheckOutDate?.split('/')[2]}-{booking.CheckOutDate?.split('/')[1]}-
                    {booking.CheckOutDate?.split('/')[0]}
                  </Typography>
                </div>
              </div>
              <div className="py-3">
                <Typography variant="sso_track" fontWeight="bold" className="label pb-2 ">
                  {t(DICTIONARY_CONSTANT.SSO.Global.NIGHT)}
                </Typography>
                <Typography variant="l2">{booking.Nights}</Typography>
              </div>
              <div className="py-3">
                <Typography variant="sso_track" fontWeight="bold" className="label pb-2 ">
                  {t(DICTIONARY_CONSTANT.SSO.Global.NUMBER_OF_GUEST)}
                </Typography>
                <Typography variant="l2">{booking.NumberOfGuests}</Typography>
              </div>
              <div className="py-3">
                <Typography variant="sso_track" fontWeight="bold" className="label pb-2">
                  {t(DICTIONARY_CONSTANT.SSO.Global.HOTEL)}
                </Typography>
                <Typography variant="l2">{booking.HotelId}</Typography>
              </div>
              <div className="py-3">
                <Typography variant="sso_track" fontWeight="bold" className="label pb-2 ">
                  {t(DICTIONARY_CONSTANT.SSO.Global.ROOM_TYPE)}
                </Typography>
                <Typography variant="l2">{booking.RoomType}</Typography>
              </div>
              <div className="py-3">
                <Typography variant="sso_track" fontWeight="bold" className="label pb-2">
                  {t(DICTIONARY_CONSTANT.SSO.Global.STATUS)}
                </Typography>
                <Typography variant="l2">{booking.Status}</Typography>
              </div>
            </div>
          </div>
        </React.Fragment>
      ))}
      {!upcomingBookingDetail?.length && (
        <Typography variant="l2">{t(DICTIONARY_CONSTANT.SSO.Global.NO_CURRENT_BOOKING)}</Typography>
      )}
      <div className="my-5 border border-t-[#d7d6d5] sm:block"></div>
    </div>
  );
};

export default UpcomingBooking;
