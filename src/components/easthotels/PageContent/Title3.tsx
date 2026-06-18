import React, { useRef, JSX } from 'react';
import HeaderSection from 'components/easthotels/Navigation/HeaderSection';
import FadeInUp from 'components/easthotels/Animation/FadeInUp';
import Typography from 'components/easthotels/Typography/Typography';
import { useScroll } from 'framer-motion';
import { Title3Prop } from '@/props/PageContent/Title3Prop';
import {
  Text as ScText,
  RichText as ScRichText,
  useSitecoreContext,
  withDatasourceCheck,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { SitecorePageProps } from 'lib/page-props';
import {
  PageRouteFields,
  _MultiHeadingSimplePageFields,
  _SimplePageFields,
} from '@/props/Core/PageProps';
import RichTextTypography from '../Typography/RichTextTypography';
import ComponentError from '../Error/ComponentError';

// This component support page level and component level data
// Datasource content takes priority over page level data

export const Default = (title3Props: Title3Prop): JSX.Element => {
  try {
    const context = useSitecoreContext();
    const { route } = context.sitecoreContext;
    const pageFields = route?.fields as PageRouteFields & _MultiHeadingSimplePageFields;
    const itemPath = (context as any).itemPath;

    const heading1Field = title3Props.fields ? title3Props.fields.Heading1 : pageFields.Heading1;
    const heading2Field = title3Props.fields ? title3Props.fields.Heading2 : pageFields.Heading2;
    const descriptionField = title3Props.fields
      ? title3Props.fields.Description
      : pageFields.Description;
    const sitecoreCss = title3Props.params?.Styles ?? '';

    return (
      <>
        {!itemPath.include('special-offers/join-our-membership/') && (
          <div className={`small-section-container ${sitecoreCss} !max-w-[820px]`}>
            <div className="mx-[15px] flex flex-col lg:items-center lg:text-center ">
              <div>
                <HeaderSection heading1={heading1Field} heading2={heading2Field} textVariant="h1" />
                <FadeInUp>
                  <div className="text-left">
                    <RichTextTypography>
                      <ScRichText field={descriptionField} />
                    </RichTextTypography>
                  </div>
                </FadeInUp>
              </div>
            </div>
          </div>
        )}
      </>
    );
  } catch (err) {
    return <ComponentError error={err} />
  }
};
