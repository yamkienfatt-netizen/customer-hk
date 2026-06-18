import FadeInUp from 'components/easthotels/Animation/FadeInUp';
import React from 'react';
import Typography from 'components/easthotels/Typography/Typography';
import RichTextTypography from 'components/easthotels/Typography/RichTextTypography';
import {
  withDatasourceCheck,
  Image as ScImage,
  Text as ScText,
  RichText as ScRichText,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { OneColumnImageProps } from '@/props/PageContent/OneColumnImageProps';
import ComponentError from '../Error/ComponentError';
import { cn } from 'lib/utils';
const Default = (oneColumnImageProps: OneColumnImageProps) => {
  try {
    const sitecoreCss = oneColumnImageProps.params?.Styles ?? '';
    const smallerWidthCss = sitecoreCss.includes('SmallerWidth') ? 'lg:max-w-[1000px]' : '';

    return (
      //flex justify-center
      <div className={'mx-[15px] flex justify-center lg:mx-[50px]'}>
        <div className={cn('small-section-container', sitecoreCss, smallerWidthCss)}>
          {/* <FadeInUp> */}
          {/* mx-[15px] lg:mx-[50px] lg:w-[calc(100%-100px)]*/}
          <div className="relative h-full w-full">
            <div>
              <ScImage
                field={oneColumnImageProps.fields.Image}
                className={'h-full w-full object-cover'}
              />
            </div>

            <div className="mt-[20px]">
              <Typography variant="h4">
                <ScText field={oneColumnImageProps.fields.Title} />
              </Typography>
            </div>

            <div className="my-[20px]">
              <RichTextTypography>
                <ScRichText field={oneColumnImageProps.fields.Content} />
              </RichTextTypography>
            </div>
          </div>
          {/* </FadeInUp> */}
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default withDatasourceCheck()<OneColumnImageProps>(Default);
