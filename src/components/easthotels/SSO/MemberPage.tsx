'use client';

import React, { useState, useEffect, JSX } from 'react';
import Sidebar from './Sidebar';
import UpcomingBooking from './UpcomingBooking';
import MyProfile from './MyProfile';
import MemberOffers from './MemberOffers';
import MemberOffersDetail from './MemberOffersDetail';
import {
  Field,
  GetServerSideComponentProps,
  ImageField,
  LinkField,
  useComponentProps,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { signOut } from 'next-auth/react';
import { useI18n } from 'next-localization';
import { GetRoomImagesService } from '@/graphql/RoomImagesQuery.service';
import { RoomImagesField } from '@/props/Graphql/RoomImagesQueryProps';
import { ComponentProps } from 'lib/component-props';
import { BannerProps, CardProps } from './types';
import { GetLocaleUrl } from '@/utilities/LanguageUtilities';
import { sendGTMEvent } from '@next/third-parties/google';

interface MemberOffersProps extends ComponentProps {
  fields: Fields;
}
interface Fields {
  SectionName: Field<string>;
  Description: Field<string>;
  BannerList: Array<BannerProps>;
  Title1: Field<string>;
  Description1: Field<string>;
  CardList1: Array<CardProps>;
  Heading2: Field<string>;
  Title2: Field<string>;
  Description2: Field<string>;
  Link2: LinkField;
  Link2Text: Field<string>;
  Image2: ImageField;
  Title3: Field<string>;
  Description3: Field<string>;
  CardList3: Array<CardProps>;
}

const MemberPage = (props: MemberOffersProps): JSX.Element => {
  //console.log('MemberPage', props);
  const { locale } = useI18n();
  const [selectedLink, setSelectedLink] = useState<string>('MEMBER OFFERS');
  const handleLinkClick = (linkText: string) => {
    if (linkText == 'LOGOUT') {
      signOut({
        callbackUrl: GetLocaleUrl('/', locale()),
        redirect: true,
      });
    } else {
      setSelectedLink(linkText);
      scrollToTop();
    }
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'instant',
    });
  };
  //const [moDetail, setmoDetail] = useState<MemberOffersDetailItem>();
  useEffect(() => {
    props.fields.BannerList.forEach((item) => {
      if (item.fields.Link != null) {
        item.click = () => {
          sendGTMEvent({
            event: 'offer_interact',
            offer_title: item.fields.OfferTitle?.value,
            intent: 'view offer details',
          });

          setSelectedLink('MemberOffersDetail' + item.fields.Link.id);
          scrollToTop();
        };
      }
    });
    props.fields.CardList1.forEach((item) => {
      item.hotel = item.fields.OfferTitle?.value;
      if (item.fields.ItemLink != null) {
        item.click = () => {
          sendGTMEvent({
            event: 'offer_interact',
            offer_title: item.fields.OfferTitle?.value,
            intent: 'discover hotel offer',
          });
          setSelectedLink('MemberOffersDetail' + item.fields.ItemLink.id);
          scrollToTop();
        };
      }
    });
    props.fields.CardList3.forEach((item) => {
      item.hotel = item.fields.OfferTitle?.value;
      if (item.fields.ItemLink != null) {
        item.click = () => {
          sendGTMEvent({
            event: 'offer_interact',
            offer_title: item.fields.OfferTitle?.value,
            intent: 'discover hotel offer',
          });
          setSelectedLink('MemberOffersDetail' + item.fields.ItemLink.id);
          scrollToTop();
        };
      }
    });
  }, []);

  const detailList = props.fields.BannerList.map((item, index) => (
    <>
      {item.fields.Link != null && (
        <div
          key={index}
          className={`sm:mx-[80px]  sm:pl-60 ${selectedLink === 'MemberOffersDetail' + item.fields.Link.id ? '' : 'hidden'}`}
        >
          <MemberOffersDetail fields={item.fields.Link.fields} />
        </div>
      )}
    </>
  ));

  // const roomImages = props.rendering?.uid
  //   ? useComponentProps<RoomImagesField[]>(props.rendering?.uid) ?? []
  //   : [];

  //console.log('roomImages', roomImages);
  return (
    <>
      <div>
        <div className="  mt-[75px] bg-[#f3f2f0]">
          <div className=" px-[15px]   sm:px-[30px]">
            <Sidebar onLinkClick={handleLinkClick} selectedLink={selectedLink} />
            <div
              className={`min-h-[50vh] sm:mx-[80px] sm:pl-60 ${selectedLink === 'UPCOMING BOOKING' ? '' : 'hidden'}`}
            >
              {/* <UpcomingBooking images={roomImages} /> */}
              <UpcomingBooking />
            </div>
            <div
              className={`sm:mx-[80px]  sm:pl-60 ${selectedLink === 'MEMBER OFFERS' ? '' : 'hidden'}`}
            >
              <MemberOffers fields={props.fields} />
            </div>
            <div
              className={`sm:mx-[80px]  sm:pl-60 ${selectedLink === 'MY PROFILE' ? '' : 'hidden'}`}
            >
              <MyProfile />
            </div>
            {/* <div
              className={`sm:mx-[80px]  sm:pl-60 ${selectedLink === 'MemberOffersDetail' ? '' : 'hidden'}`}
            > */}
            {/* {moDetail !== undefined && <MemberOffersDetail fields={moDetail} />} */}
            {detailList}
            {/* </div> */}
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
export const getServerSideProps: GetServerSideComponentProps = async (
  _rendering,
  _layoutData,
  context
) => {
  context.query.cache = '0';
  return [];
};

export default MemberPage;
