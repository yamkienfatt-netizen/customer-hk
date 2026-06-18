import React, { JSX } from 'react';
import { ComponentProps } from 'lib/component-props';
import { Placeholder as ScPlaceholder } from '@sitecore-jss/sitecore-jss-nextjs';
import ComponentError from '../Error/ComponentError';

export const LocationContent = (componentProps: ComponentProps): JSX.Element => {
  try {
    const locationContentPlaceholderKey = `locationcontent-${componentProps.params?.DynamicPlaceholderId ?? '{*}'}`;
    const sitecoreCss = componentProps.params?.Styles ?? '';

    return (
      <div className={`small-section-container ${sitecoreCss} ${componentProps.className}`}>
        <div className="mobile-location-template mt-[25px] grid w-full justify-between gap-[30px] lg:mt-0 lg:grid-cols-2 lg:gap-[20px]">
          <ScPlaceholder
            name={locationContentPlaceholderKey}
            rendering={componentProps.rendering}
          />
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};
