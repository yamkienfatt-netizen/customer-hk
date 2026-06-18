import React, { useEffect, useState } from 'react';
import Typography from '../Typography/Typography';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import useWindowSize from 'src/hooks/useWindowSize';
import CTAButton from '../Button/CTAButton';
import RoomSwiper from './RoomSwiper';
import { FloorPlanLightBox } from './FloorPlanLightBox';
import {
  withDatasourceCheck,
  Text as ScText,
  Image as ScImage,
  TextField,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { RoomComparisonProps } from '@/props/PageContent/RoomComparisonProps';
import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import { _StayDetail } from '@/props/common/_StayDetail';
import { Treelist } from '@/props/fields/ScField';
import { RoomAmenities } from '@/props/DataTemplate/RoomAmenities';
import DropDown from '../CustomTypes/Components/DropDown';
const publicUrl = getPublicUrl();
import useDimensions from 'react-cool-dimensions';
import useArrow from '@/hooks/useArrow';
import { _PageMetadata } from '@/props/common/_PageMetadata';
import { PageRouteFields } from '@/props/Core/PageProps';
import { useSearchParams } from 'next/navigation';
import { IsIDsIdentical } from '@/utilities/EastIdsConstant';
import ComponentError from '../Error/ComponentError';
import { cn } from 'lib/utils';
import Image from 'next/image';

const RoomType = ({
  room,
  roomTypeArr,
  onItemSelected,
  selectedRoomType,
}: {
  room: TextField;
  roomTypeArr: { text: TextField; id: string }[];
  onItemSelected: (roomTypeText: string, id: string) => void;
  selectedRoomType: { text: string | number | undefined; id: string };
}) => {
  try {
    const { observe, unobserve, width, height, entry } = useDimensions({
      onResize: ({ observe, unobserve, width, height, entry }) => {
        // Triggered whenever the size of the target is changed...

        unobserve(); // To stop observing the current target element
        observe(); // To re-start observing the current target element
      },
    });
    return (
      <div className="relative flex min-h-[42px] flex-col justify-center lg:min-h-0" ref={observe}>
        <DropDown
          dropdownItems={roomTypeArr}
          Width={448}
          // Height={42}
          onItemSelected={(roomTypeText, id) => {
            onItemSelected(roomTypeText, id || '0');
          }}
        >
          <div className="flex h-full items-center justify-between pr-[6px]">
            <Typography variant="p">
              <ScText field={{ value: selectedRoomType.text }} editable={false} />
            </Typography>
            <Image src={`${publicUrl}/icon_header_arrow.svg`} alt="location" width={6} height={5} />
          </div>
        </DropDown>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

const RoomInfo = ({
  label,
  info,
  editable,
  className,
}: {
  label: string;
  info: TextField;
  editable: boolean;
  className?: string;
}) => {
  try {
    return (
      <div className="mb-[20px] flex flex-col items-center lg:mb-[30px]">
        <Typography variant="l1" fontWeight="bold" extraStyles="mb-[5px] lg:mb-[10px]">
          {label}
        </Typography>
        <Typography variant="p" className={cn('text-center', className)}>
          <ScText field={info} editable={editable} />
        </Typography>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

const RoomInfoTemplate = ({
  roomTemplateNum,
  data,
  roomTypeArr,
  onItemSelected,
  selectedRoomType,
  swiperArrowColor,
}: {
  roomTemplateNum: string;
  data: Treelist<_StayDetail>;
  roomTypeArr: { text: TextField; id: string }[];
  onItemSelected: (roomTypeText: string, id: string) => void;
  selectedRoomType: { text: string | number | undefined; id: string };
  swiperArrowColor: string;
}) => {
  try {
    const { t } = useI18n();
    const { isMobile } = useWindowSize();

    const numberOfColumns = isMobile ? 1 : 2;
    const amenitiesData = isMobile ? [[]] : [[], []];

    data?.fields.FeatureList.map((item, index) => {
      const r = index % numberOfColumns;
      amenitiesData[r].push(item);
    });
    data?.fields.AmenitiesList.map((item, index) => {
      const r = index % numberOfColumns;
      amenitiesData[r].push(item);
    });

    return (
      <div className="lg:px-[30px]">
        <div className="relative mb-[30px] border-b border-[#CFCFCF] pb-[11px] lg:mb-[50px] lg:h-auto">
          <RoomType
            room={data?.fields.RoomType}
            roomTypeArr={roomTypeArr}
            onItemSelected={(roomTypeText, id) => onItemSelected(roomTypeText, id)}
            selectedRoomType={selectedRoomType}
          />
        </div>

        <div className="mb-[20px] lg:mb-[40px]">
          <RoomSwiper
            data={data?.fields.RoomImages}
            swiperArrowColor={swiperArrowColor}
            roomTemplateNum={roomTemplateNum}
          />
        </div>

        <div className="flex flex-col items-center lg:flex">
          <Typography
            variant="h2"
            font="Bellefair"
            extraStyles="mb-[40px] mb-[30px] hidden lg:block"
          >
            <ScText field={data?.fields.Title} />
          </Typography>

          <RoomInfo
            label={t(DICTIONARY_CONSTANT.STAYS.ROOM_TYPE)}
            info={data?.fields.RoomType}
            editable={true}
          />
          <RoomInfo
            label={t(DICTIONARY_CONSTANT.STAYS.ROOM_SIZE)}
            info={data?.fields.RoomSize}
            editable={true}
            className="h-[36px]"
          />
          <RoomInfo
            label={t(DICTIONARY_CONSTANT.STAYS.ROOM_VIEW)}
            info={data?.fields.RoomView}
            editable={true}
          />
          <RoomInfo
            label={t(DICTIONARY_CONSTANT.STAYS.BED_SIZE)}
            info={data?.fields.BedSize}
            editable={true}
          />

          <div className="mb-[20px] flex flex-col items-center lg:mb-[30px]">
            <Typography variant="l1" fontWeight="bold" extraStyles="mb-[5px] lg:mb-[10px]">
              {t(DICTIONARY_CONSTANT.STAYS.FLOOR_PLAN)}
            </Typography>
            {!isMobile ? (
              <ScImage
                field={data?.fields.FloorPlan}
                className="max-h-[252px] max-w-[500px] object-contain"
              />
            ) : (
              data?.fields.FloorPlan?.value?.src && (
                <FloorPlanLightBox floorplanImage={data?.fields.FloorPlan}>
                  <Typography
                    variant="l1"
                    fontWeight="bold"
                    underline
                    extraStyles="border-black-secondary"
                  >
                    {t(DICTIONARY_CONSTANT.STAYS.VIEW_FLOOR_PLAN)}
                  </Typography>
                </FloorPlanLightBox>
              )
            )}
          </div>

          {data?.fields?.VirtualTourLink?.value?.href &&
            data?.fields?.VirtualTourLink?.value?.href !== 'http://' && (
              <CTAButton
                url={data?.fields?.VirtualTourLink}
                text={t(DICTIONARY_CONSTANT.STAYS.VIRTUAL_TOUR)}
                variant={'underlined'}
              />
            )}
        </div>

        <hr className="my-[30px] bg-[#CFCFCF] lg:my-[50px]" />

        <Typography variant="l1" fontWeight="bold" extraStyles="mb-[9px] lg:mb-[19px]">
          {t(DICTIONARY_CONSTANT.STAYS.AMENITIES)}
        </Typography>
        <div className="grid lg:gap-[30px]" style={{ gridTemplateColumns: 'auto auto auto' }}>
          {amenitiesData.map((col, index) => {
            return (
              <div className="flex flex-col">
                {col.map((amenity: Treelist<RoomAmenities>, index) => {
                  return (
                    <Typography key={index} variant="p" extraStyles="mb-[10px]">
                      <ScText field={amenity.fields.Title} />
                    </Typography>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="flex w-full justify-center">
          <div className="mt-[40px] max-h-[40px] w-full max-w-[285px] lg:mt-[50px]">
            <CTAButton
              variant="contained-big"
              url={data?.url as string}
              text={t(DICTIONARY_CONSTANT.CTA.ROOM_COMPARISON_VIEW_DETAIL)}
              fontColor="white"
              bgColor="green-primary"
            ></CTAButton>
          </div>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

const Default = (roomComparisonProps: RoomComparisonProps) => {
  try {
    const searchParams = useSearchParams();
    const room1Id = searchParams.get('itm1');
    const room2Id = searchParams.get('itm2');

    const { t } = useI18n();
    const context = useSitecoreContext();
    const { route } = context.sitecoreContext;
    const pageFields = route?.fields as PageRouteFields & _PageMetadata;

    const { arrowColor } = useArrow(
      pageFields.IsPropertyInnerPage.value,
      pageFields.IsBrandInnerPage.value
    );

    const firstRoom = roomComparisonProps.fields.Rooms.find((room) => {
      return IsIDsIdentical(room1Id, room.id);
    });

    const [selectedRoomType1, setSelectedRoomType1] = useState({
      text: firstRoom
        ? firstRoom.fields.Title.value
        : roomComparisonProps.fields.Rooms[0]?.fields.Title.value,
      id: firstRoom ? firstRoom.id : roomComparisonProps.fields.Rooms[0]?.id,
    });

    const secondRoom = roomComparisonProps.fields.Rooms.find((room) => {
      return IsIDsIdentical(room2Id, room.id);
    });
    const secondRoomIndex = roomComparisonProps.fields.Rooms.length > 1 ? 1 : 0;
    const [selectedRoomType2, setSelectedRoomType2] = useState({
      text: secondRoom
        ? secondRoom.fields.Title.value
        : roomComparisonProps.fields.Rooms[secondRoomIndex]?.fields.Title.value,
      id: secondRoom ? secondRoom.id : roomComparisonProps.fields.Rooms[secondRoomIndex]?.id,
    });

    const [roomData1, setRoomData1] = useState(
      firstRoom ? firstRoom : roomComparisonProps.fields.Rooms[0]
    );
    const [roomData2, setRoomData2] = useState(
      secondRoom ? secondRoom : roomComparisonProps.fields.Rooms[secondRoomIndex]
    );

    const roomTypeArr = roomComparisonProps.fields.Rooms.map((item, index) => {
      return { text: { value: item.fields.Title.value }, id: item.id };
    });

    const getRoomData = (roomID, stateToChange) => {
      const idToCompare =
        stateToChange === 'roomData1' ? selectedRoomType1.id : selectedRoomType2.id;

      if (roomID !== idToCompare) {
        const targetedRoom =
          roomComparisonProps.fields.Rooms.find((room) => room.id === roomID) ||
          roomComparisonProps.fields.Rooms[0];

        if (stateToChange === 'roomData1') {
          setRoomData1(targetedRoom);
        } else {
          setRoomData2(targetedRoom);
        }
      }
    };
    const sitecoreCss = roomComparisonProps.params?.Styles ?? '';
    return (
      <div className={'small-section-container ' + sitecoreCss}>
        <div className="mx-[15px]">
          <Typography
            variant="l3"
            fontWeight="bold"
            extraStyles="text-center mb-[30px] lg:mb-[50px]"
          >
            {t(DICTIONARY_CONSTANT.STAYS.ROOM_COMPARISON)}
          </Typography>
          <div className="grid grid-cols-2 gap-[15px] lg:gap-0">
            <div className="border-black-secondary lg:border-r">
              <RoomInfoTemplate
                roomTemplateNum={'01'}
                data={roomData1}
                roomTypeArr={roomTypeArr}
                selectedRoomType={selectedRoomType1}
                onItemSelected={(roomTypeText, id) => {
                  setSelectedRoomType1({ text: roomTypeText, id: id });
                  getRoomData(id, 'roomData1');
                }}
                swiperArrowColor={arrowColor}
              />
            </div>
            <RoomInfoTemplate
              roomTemplateNum={'02'}
              data={roomData2}
              roomTypeArr={roomTypeArr}
              selectedRoomType={selectedRoomType2}
              onItemSelected={(roomTypeText, id) => {
                setSelectedRoomType2({ text: roomTypeText, id: id });
                getRoomData(id, 'roomData2');
              }}
              swiperArrowColor={arrowColor}
            />
          </div>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default withDatasourceCheck()<RoomComparisonProps>(Default);
