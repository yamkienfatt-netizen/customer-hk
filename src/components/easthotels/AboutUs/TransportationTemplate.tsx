import { _SimplePageFields } from '@/props/Core/PageProps';
import React, { JSX } from 'react';
import { ComponentProps } from 'lib/component-props';
import { Placeholder as ScPlaceholder } from '@sitecore-jss/sitecore-jss-nextjs';
import CTAButton from '../Button/CTAButton';
import ComponentError from '../Error/ComponentError';

export const Default = (componentProps: ComponentProps): JSX.Element => {
  try {
    const transportationTemplatePlaceholderKey = `transportationtemplate`;
    const sitecoreCss = componentProps.params?.Styles ?? '';

    return (
      <div
        className={
          'transport-template small-section-container !lg:mx-0 !ml-0 !mr-[15px] !max-w-[600px]' +
          sitecoreCss
        }
      >
        <ScPlaceholder
          name={transportationTemplatePlaceholderKey}
          rendering={componentProps.rendering}
        />
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};
