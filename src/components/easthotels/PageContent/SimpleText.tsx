import React from 'react';
import FadeInUp from '../Animation/FadeInUp';
import Typography from '../Typography/Typography';
import {
  Text as ScText,
  RichText as ScRichText,
  withDatasourceCheck,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs';
import RichTextTypography from '../Typography/RichTextTypography';
import { SimpleTextProps } from '@/props/PageContent/SimpleTextProps';
import ComponentError from '../Error/ComponentError';
import { cn } from 'lib/utils';

export const Default = (simpleTextProps: SimpleTextProps) => {
  try {
    const sitecoreContext = useSitecoreContext();
    const isPageEditing = sitecoreContext.sitecoreContext.pageEditing
      ? sitecoreContext.sitecoreContext.pageEditing
      : false;

    const arrow = simpleTextProps?.params?.Styles.includes('with-arrow') ? 'with-arrow' : '';
    const verticalDivider = simpleTextProps?.params?.Styles.includes('verticalLine')
      ? 'verticalLine'
      : '';
    const variant = (simpleTextProps?.params?.Styles || '').split('title-')[1]?.trim() || 'l3';

    const isCenter = simpleTextProps.params?.Styles.includes('Center')
      ? '!max-w-[768px] mx-auto'
      : '';

    return (
      <FadeInUp>
        {/* <div className={arrow + ' ' + verticalDivider}> */}
        <div className={cn(arrow, verticalDivider, isCenter)}>
          {(simpleTextProps.fields.Title || isPageEditing) && (
            <div className={'mb-[20px] '}>
              <Typography variant={variant} fontWeight={variant === 'l3' ? 'bold' : 'regular'}>
                <ScText field={simpleTextProps.fields.Title} />
              </Typography>
            </div>
          )}

          {(simpleTextProps.fields.Description || isPageEditing) && (
            <div className="mb-[20px]">
              <Typography variant="l3" fontWeight="bold">
                <ScText field={simpleTextProps.fields.Description} />
              </Typography>
            </div>
          )}

          {(simpleTextProps.fields.Content || isPageEditing) && (
            <RichTextTypography>
              <ScRichText field={simpleTextProps.fields.Content} />
            </RichTextTypography>
          )}
        </div>
      </FadeInUp>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default withDatasourceCheck()<SimpleTextProps>(Default);
