import { PageRouteFields, _SimplePageFields } from '@/props/Core/PageProps';
import { Text1Props } from '@/props/PageContent/Text1Props';
import { useSitecoreContext, RichText as ScRichText } from '@sitecore-jss/sitecore-jss-nextjs';
import RichTextTypography from 'components/easthotels/Typography/RichTextTypography';
import React, { JSX } from 'react';
import ComponentError from '../Error/ComponentError';

// This component support page level and component level data
// Datasource content takes priority over page level data

export const Default = (text1Props: Text1Props): JSX.Element => {
  try {
    const sitecoreCss = text1Props.params?.Styles ?? '';
    const sitecoreContext = useSitecoreContext();
    const { route } = sitecoreContext.sitecoreContext;
    const pageFields = route?.fields as PageRouteFields & _SimplePageFields;

    const contentField = text1Props.fields ? text1Props.fields.Content : pageFields.Content;

    return (
      <div className={'small-section-container !max-w-[850px] ' + sitecoreCss}>
        <div className="mx-[15px] lg:mx-0">
          <RichTextTypography>
            <ScRichText field={contentField} />
          </RichTextTypography>
          {/* <div className="richtext overflow-auto">
          <RichTextTypography>{table}</RichTextTypography>
        </div> */}
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};
