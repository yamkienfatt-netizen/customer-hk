import React from 'react';

import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import StayDetailSideMenu from 'components/easthotels/Room/StayDetailSideMenu';
import Typography from 'components/easthotels/Typography/Typography';
import BookNow from 'components/easthotels/StayAtEast/BookNow';
import RichTextTypography from 'components/easthotels/Typography/RichTextTypography';
import { PageRouteFields } from '@/props/Core/PageProps';
import {
  useSitecoreContext,
  Text as ScText,
  RichText as ScRichText,
  Placeholder as ScPlaceholder,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { _StayDetail } from '@/props/common/_StayDetail';
import { ComponentProps } from 'lib/component-props';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import { useI18n } from 'next-localization';
import ComponentError from '../Error/ComponentError';

const StayTemplate = (componentProps: ComponentProps) => {
  try {
    const context = useSitecoreContext();
    const { route } = context.sitecoreContext;
    const pageFields = route?.fields as PageRouteFields & _StayDetail;

    const { t } = useI18n();

    const stayTemplate1PlaceholderKey = `staytemplate-1`;
    const stayTemplate2PlaceholderKey = `staytemplate-2`;
    const stayTemplate3PlaceholderKey = `staytemplate-3`;
    const sitecoreCss = componentProps.params?.Styles ?? '';
    const { HotelId, RoomCategory } = pageFields || {};

    return (
      <div className={'full-width-section-container relative ' + sitecoreCss}>
        <ScPlaceholder name={stayTemplate1PlaceholderKey} rendering={componentProps.rendering} />

        <div className="flex flex-col justify-center px-[15px] lg:flex-row lg:px-[30px]">
          <div className="sticky top-[77px] mr-[129px] hidden h-fit max-w-[300px] pt-[70px] lg:block">
            <StayDetailSideMenu {...pageFields} />
          </div>

          <div className="mt-[39px] lg:mt-[60px] lg:max-w-[630px]">
            <Typography variant="inner-h1" font="Bellefair" extraStyles=" mb-[30px] lg:mb-[40px]">
              <ScText field={pageFields.Title} />
            </Typography>
            <div className="lg:hidden ">
              <StayDetailSideMenu {...pageFields} />
            </div>
            <RichTextTypography>
              <ScRichText field={pageFields.Content} />
            </RichTextTypography>
            <div className="mb-0 lg:mb-[40px]" />

            <div>
              <ScPlaceholder
                name={stayTemplate2PlaceholderKey}
                rendering={componentProps.rendering}
              />
            </div>
          </div>
        </div>

        <ScPlaceholder name={stayTemplate3PlaceholderKey} rendering={componentProps.rendering} />

        {/* ToWen: BookNow needs siteConfigurationProp and hotelId when convert to sitecore component thankss*/}
        {/* <BookNow isProperty hotelId={HotelId} roomCategory={RoomCategory}>
          <div className="fixed bottom-0 z-10 mt-[30px] flex min-h-[50px] w-full items-center justify-center bg-green-primary text-white shadow-[0px_-5px_10px_#00000029] hover:cursor-pointer lg:hidden">
            <Typography variant="l3" fontWeight="bold" fontColor="white" extraStyles="mt-[3px]">
              {t(DICTIONARY_CONSTANT.RESERVATIONS.BOOK_NOW)}
            </Typography>
          </div>
        </BookNow> */}

        {/* ToWen: BookNow needs siteConfigurationProp and hotelId when convert to sitecore component thankss*/}
        {/* <BookNow isProperty hotelId={HotelId} roomCategory={RoomCategory}>
          <div className="fixed bottom-0 z-10 hidden w-full justify-end pb-[30px] pr-[30px] lg:flex">
            <div className="flex h-[128px] min-h-[50px] w-[128px] items-center justify-center rounded-full bg-green-primary text-white hover:cursor-pointer">
              <Typography
                variant="l3"
                fontWeight="bold"
                fontColor="white"
                extraStyles="mt-[3px] text-center"
              >
                {t(DICTIONARY_CONSTANT.RESERVATIONS.BOOK_NOW)}
              </Typography>
            </div>
          </div>
        </BookNow> */}
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default StayTemplate;
