import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { motion } from 'framer-motion';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import useWindowSize from '@/hooks/useWindowSize';
import Typography from 'components/easthotels/Typography/Typography';
import ListingCard from 'components/easthotels/Article/ListingCard';
import { SpeakerBioLightbox } from 'components/easthotels/Event/SpeakerBioLightbox';
import {
  withDatasourceCheck,
  Image as ScImage,
  Text as ScText,
  RichText as ScRichText,
  GetServerSideComponentProps,
  useSitecoreContext,
  useComponentProps,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { CompareListingSwiperProps } from '@/props/PageContent/CompareListingSwiperProps';
import ListingSwiper from 'components/easthotels/Article/ListingSwiper';
import { GetSiteStartItemId } from '@/utilities/ContentUtilities';
import { GetRoomDetailsService } from '@/graphql/RoomDetailsQuery.service';
import { PageRouteFields } from '@/props/Core/PageProps';
import { _PageMetadata } from '@/props/common/_PageMetadata';
import { RoomDetailsField } from '@/props/Graphql/RoomDetailsQueryProps';
import ListingSwiperGraphQL from '../Article/ListingSwiperGraphQL';
import { IsIDsIdentical } from '@/utilities/EastIdsConstant';
import ErrorBoundary from '../Error/ErrorBoundary';
import ComponentError from '../Error/ComponentError';

const Default = (compareListingSwiperProps: CompareListingSwiperProps) => {
  try {
    const context = useSitecoreContext();
    const { route } = context.sitecoreContext;
    const pageFields = route?.fields as PageRouteFields & _PageMetadata;

    const sitecoreCss = compareListingSwiperProps.params?.Styles ?? '';

    const roomGraphQL = compareListingSwiperProps.rendering.uid
      ? useComponentProps<Array<RoomDetailsField>>(compareListingSwiperProps.rendering.uid)
      : undefined;

    return (
      <div className={'small-section-container relative ' + sitecoreCss}>
        <Typography variant="h2" font="Bellefair" extraStyles="ml-[15px] lg:text-center mb-[30px]">
          <ScText field={compareListingSwiperProps.fields.Title} />
        </Typography>

        <ListingSwiperGraphQL
          articleData={roomGraphQL}
          spaceBetween={30}
          currentPageId={route?.itemId!}
          isPropertyPage={pageFields.IsPropertyInnerPage}
          compareUrl={compareListingSwiperProps.fields.ComparisonPage.value.href}
          isStay={true}
        />
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default withDatasourceCheck()<CompareListingSwiperProps>(Default);

export const getServerSideProps: GetServerSideComponentProps = async (rendering, layoutData) => {
  const { route, context } = layoutData?.sitecore;
  const { ContentTemplate } = (rendering as CompareListingSwiperProps).fields;

  if (!ContentTemplate.id) {
    return [];
  }

  var startItem = GetSiteStartItemId(context.itemPath);
  var rooms = await GetRoomDetailsService(
    startItem,
    ContentTemplate.id,
    layoutData?.sitecore?.context?.language!,
    ''
  );

  // Filter out current eat and drink page (in eat & drink detail page)
  rooms = rooms.filter((item, index) => {
    return !IsIDsIdentical(item.id, route?.itemId!);
  });

  return rooms;
};
