import { PageRouteFields, BrandeNewsDetailPageFields } from '@/props/Core/PageProps';
import {
  useSitecoreContext,
  Text as ScText,
  LayoutServicePageState,
} from '@sitecore-jss/sitecore-jss-nextjs';
import Typography from 'components/easthotels/Typography/Typography';
import React, { JSX } from 'react';
import ComponentError from '../Error/ComponentError';

export const Default = (): JSX.Element => {
  try {
    const sitecoreContext = useSitecoreContext();
    const { route } = sitecoreContext.sitecoreContext;
    const pageFields = route?.fields as PageRouteFields & BrandeNewsDetailPageFields;
    const isPageEditing = sitecoreContext.sitecoreContext.pageEditing
      ? sitecoreContext.sitecoreContext.pageEditing
      : false;

    return (
      <>
        {(pageFields.Legend || isPageEditing) && (
          <div className="mb-[20px]">
            <Typography variant="l3" fontWeight="bold">
              <ScText field={pageFields.Legend} />
            </Typography>
          </div>
        )}
        {(pageFields.Title || isPageEditing) && (
          <div className="mb-[40px]">
            <Typography variant="h2" font="Bellefair">
              <ScText field={pageFields.Title} />
            </Typography>
          </div>
        )}
        {(pageFields.Description || isPageEditing) && (
          <div className="">
            <Typography variant="p">
              <ScText field={pageFields.Description} />
            </Typography>
          </div>
        )}
      </>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};
