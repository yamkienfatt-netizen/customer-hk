import React, { useEffect, useState, JSX } from 'react';
import NavigationSideBar from './NavigationSideBar';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import { Image, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';
import { RoomImagesProps } from '@/props/Graphql/RoomImagesQueryProps';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import { useI18n } from 'next-localization';
import Typography from '../Typography/Typography';
import { StatusList } from '@/utilities/SsoConstant';

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
const UpcomingStaysPage = (): JSX.Element => {
  const { t, locale } = useI18n();
  const [hasBooking, setGetUpcomingBooking] = useState(false);
  const bookingArr: bookingDetails[] = [];
  const [upcomingBookingDetail, setUpcomingBookingDetail] = useState(bookingArr);

  // const roomImages = props.rendering?.uid
  //   ? useComponentProps<RoomImagesField[]>(props.rendering?.uid) ?? []
  //   : [];

  useEffect(() => {
    (async () => {
      if (!hasBooking) {
        try {
          const origin = getPublicUrl();
          const response = await fetch(`${origin}/api/booking/getUpcomingBooking`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (response.status == 200) {
            const data = (await response.json()) as bookingDetails[];
            const roomImagePromises = data.map(async (item) => {
              if (item.HotelId != undefined && item.RoomType != undefined) {
                try {
                  const roomData = await fetch(
                    `${origin}/api/booking/getRoomImage?HotelId=${item.HotelId}&RoomType=${
                      item.RoomType
                    }&Locale=${locale()}`,
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
              return item;
            });

            const updatedData = await Promise.all(roomImagePromises);
            setUpcomingBookingDetail(updatedData);
            setUpcomingBookingDetail(data);
          }
          // else if (response.status == 401) {
          //   toLogin();
          // }
          else {
            console.log('no data');
            return;
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          return;
        }
        setGetUpcomingBooking(true);
      }
    })();
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      {isLoading ? (
        <div id="loading-state">
          <div id="loading"></div>
        </div>
      ) : null}
      <div className="mt-[75px] px-[15px] sm:flex sm:px-[30px]">
        <NavigationSideBar
          setIsLoading={setIsLoading}
          selectedValue={'UPCOMING_BOOKING'}
        ></NavigationSideBar>
        <div className="px-[15px] sm:w-[calc(100vw-330px)] sm:px-[30px]">
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
                          {booking.CheckOutDate?.split('/')[2]}-
                          {booking.CheckOutDate?.split('/')[1]}-
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
              <Typography variant="l2">
                {t(DICTIONARY_CONSTANT.SSO.Global.NO_CURRENT_BOOKING)}
              </Typography>
            )}
            <div className="my-5 border border-t-[#d7d6d5] sm:block"></div>
          </div>
        </div>
      </div>
    </>
  );
};

// export const getServerSideProps: GetServerSideComponentProps = async (
//   rendering,
//   layoutData,
//   context
// ) => {
//   context.query.cache = '0';
//   if (layoutData?.sitecore?.route?.itemId) {
//     try {
//       const resultHotel = await GetRoomImagesService(
//         '{03951BAD-C61F-487B-891F-D83C679B201D}',
//         '{4995CC63-670F-4761-8DC7-27BE51A45790}',
//         layoutData?.sitecore?.context?.language ?? 'en',
//         ''
//       );
//       const resultRoom = await GetRoomImagesService(
//         '{40639523-8C65-4D82-AC39-D5EC3703B264}',
//         '{4995CC63-670F-4761-8DC7-27BE51A45790}',
//         layoutData?.sitecore?.context?.language ?? 'en',
//         ''
//       );
//       const rh = resultHotel.map((item) => ({ ...item, Type: 'Hotel' }));
//       const rr = resultRoom.map((item) => ({ ...item, Type: 'Room' }));
//       return [...rh, ...rr];
//     } catch (err) {
//       console.log('room images err', err);
//     }
//   }
//   return [];
// };
export default UpcomingStaysPage;
