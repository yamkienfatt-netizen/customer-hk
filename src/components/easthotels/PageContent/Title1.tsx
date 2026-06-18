import React, { JSX } from 'react';
import HeaderSection from 'components/easthotels/Navigation/HeaderSection';
import FadeInUp from 'components/easthotels/Animation/FadeInUp';
import { Title1Prop } from '@/props/PageContent/Title1Prop';
import { RichText as ScRichText, useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';
import {
  PageRouteFields,
  _MultiHeadingSimplePageFields,
  _SimplePageFields,
} from '@/props/Core/PageProps';
import RichTextTypography from '../Typography/RichTextTypography';
import ComponentError from '../Error/ComponentError';

// This component support page level and component level data
// Datasource content takes priority over page level data

export const Default = (title1Props: Title1Prop): JSX.Element => {
  try {
    const context = useSitecoreContext();
    const { route } = context.sitecoreContext;
    const pageFields = route?.fields as PageRouteFields & _MultiHeadingSimplePageFields;

    const heading1Field = title1Props.fields ? title1Props.fields.Heading1 : pageFields.Heading1;
    const heading2Field = title1Props.fields ? title1Props.fields.Heading2 : pageFields.Heading2;
    const descriptionField = title1Props.fields
      ? title1Props.fields.Description
      : pageFields.Description;
    const sitecoreCss = title1Props.params?.Styles ?? '';

    return (
      <div className={`small-section-container_70-margin ${sitecoreCss} !max-w-[768px]`}>
        <div className=" mx-[15px] flex flex-col lg:mx-0 lg:items-center lg:text-center">
          <HeaderSection heading1={heading1Field} heading2={heading2Field} textVariant="inner-h1" />
          <FadeInUp>
            <RichTextTypography>
              <ScRichText field={descriptionField} />
            </RichTextTypography>
          </FadeInUp>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};
