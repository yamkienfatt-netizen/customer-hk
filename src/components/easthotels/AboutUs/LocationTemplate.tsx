import React from 'react';
import { LocationContent } from './LocationContent';
import { LocationTemplateProps } from '@/props/Maps/LocationTemplateProps';
import { useI18n } from 'next-localization';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import AMapComponent from './amap';
import ComponentError from '../Error/ComponentError';

export const Default = (locationTemplateProps: LocationTemplateProps) => {
  try {
    const { locale } = useI18n();
    const sitecoreCss = locationTemplateProps.params?.Styles ?? '';

    return (
      <div className={'small-section-container !ml-0 ' + sitecoreCss}>
        {(locale() !== 'sc' && locale() !== 'zh-CN') ? (
          <div className="google-map-code">
            <iframe
              src={locationTemplateProps.fields.GoogleMapEmbededURL.value! as string}
              style={{
                border: 0,
                marginTop: '-150px',
              }}
              aria-hidden="false"
              tabIndex={0}
            />
          </div>
        ) : (
          <AMapComponent {...locationTemplateProps} />
        )}
        <LocationContent {...locationTemplateProps} />
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default withDatasourceCheck()<LocationTemplateProps>(Default);
