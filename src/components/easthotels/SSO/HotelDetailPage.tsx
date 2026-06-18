import { Image, RichText, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import NavigationSideBar from './NavigationSideBar';
import { MemberOffersDetailItem, MemberOfferSectionProps } from './types';
import { useState, JSX } from 'react';
import Typography from '../Typography/Typography';
import { sendGTMEvent } from '@next/third-parties/google';
import { useUrlForBookingRooms } from '@/hooks/useUrlForBookingRooms';
import useSabreSession from '@/hooks/useSabreSession';

interface MemberOffersDetailProps {
  fields: MemberOffersDetailItem;
}
const Dropdown = (item: MemberOfferSectionProps) => {
  const [openDrop, setOpenDrop] = useState(false);
  const handleDropdown = () => {
    setOpenDrop(!openDrop);
  };
  return (
    <>
      <div className="mb-5 flex justify-between ">
        <Typography variant="sso_track" fontWeight="bold">
          <Text field={item.fields.Subtitle} />
        </Typography>
        <div onClick={handleDropdown} className={openDrop ? 'uptriangle' : 'downtriangle'}></div>
      </div>
      <div className="sso-richtext-ul mb-5 text-[13px] leading-[18px]">
        <RichText field={item.fields.DescriptionList} className={openDrop ? '' : 'hidden'} />
      </div>
    </>
  );
};
const HotelDetailPage = (props: MemberOffersDetailProps): JSX.Element => {
  const selectedHotelId = props.fields.HotelId?.fields.HotelId.value;
  const { url } = useUrlForBookingRooms({ selectedHotelId });
  const { doSabreLogin } = useSabreSession();

  const sectionList = Object.values(props.fields.SectionList).map((item, index) => (
    <div key={index} className="mt-20 sm:grid sm:grid-cols-2 sm:gap-[30px]">
      <div className="w-auto pb-5">
        <Image field={item.fields.Image} className="w-full " />
      </div>
      <div className=" ">
        <div className="mb-5 text-[14px] leading-[18px] tracking-[1.12px] opacity-50">
          <Text field={item.fields.Heading} />
        </div>
        <div className="mb-5 font-[Bellefair] text-[30px] leading-[30px]">
          <Text field={item.fields.Title} />
        </div>
        <Typography variant="l2" className="mb-5 ">
          <RichText field={item.fields.Description} />
        </Typography>
        <a
          onClick={() => {
            sendGTMEvent({
              event: 'offer_interact',
              offer_title: item.fields.OfferTitle?.value,
              intent: 'offer book_now',
            });
            doSabreLogin(url, selectedHotelId, '_blank');
          }}
          //href={item.fields.Link.value?.href}
          className="mb-5 "
        >
          <Typography variant="sso_track" fontWeight="bold" underline fontColor="black">
            <Text field={item.fields.LinkText} />
          </Typography>
        </a>
        <div className="my-5 border border-t-[#d7d6d5] "></div>
        <Dropdown {...item} />
        <div className="my-5 border border-t-[#d7d6d5] "></div>
      </div>
    </div>
  ));
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
          selectedValue={'MEMBER_OFFERS'}
        ></NavigationSideBar>
        <div className=" sm:w-[calc(100vw-330px)] sm:px-[30px]">
          <div className="relative flex">
            <div className="absolute inset-0 z-10 flex flex-col items-start justify-center text-[40px] leading-[40px] text-white sm:pl-[30px]">
              <div>
                <Text field={props.fields.Heading} />
              </div>
              <div className="font-[Bellefair]">
                <Text field={props.fields.Title} />
              </div>
            </div>
            <div className="sso-detailimgdiv h-[370px] w-full">
              <Image field={props.fields.Image} className=" sso-detailimg  h-full  object-cover" />
            </div>
          </div>
          {sectionList}
        </div>
      </div>
    </>
  );
};

export default HotelDetailPage;
