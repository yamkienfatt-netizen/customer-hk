import React from 'react';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import Typography from 'components/easthotels/Typography/Typography';
import { withDatasourceCheck, Text as ScText } from '@sitecore-jss/sitecore-jss-nextjs';
import { SpeakerBiosProps } from '@/props/PageContent/SpeakerBioProps';
import ListingSwiper from 'components/easthotels/Article/ListingSwiper';
import ComponentError from '../Error/ComponentError';
import HeaderSection from '../Navigation/HeaderSection';

const SpeakerBio = (speakerBiosProps: SpeakerBiosProps) => {
  try {
    const IsPropertyInnerPage = speakerBiosProps.fields.IsPropertyInnerPage;
    const CTAButtonOpensLightbox = speakerBiosProps.fields.ButtonLightbox;
    const sitecoreCss = speakerBiosProps.params?.Styles ?? '';
    return (
      <div className={'small-section-container relative ' + sitecoreCss}>
        <HeaderSection
          className="mb-[30px] ml-[15px] lg:text-center"
          heading1={speakerBiosProps.fields.Heading1}
          heading2={speakerBiosProps.fields.Heading2}
        />

        <ListingSwiper
          articleData={speakerBiosProps}
          spaceBetween={40}
          isPropertyPage={IsPropertyInnerPage}
          CTAButtonOpensLightbox={CTAButtonOpensLightbox}
        />
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default withDatasourceCheck()<SpeakerBiosProps>(SpeakerBio);
