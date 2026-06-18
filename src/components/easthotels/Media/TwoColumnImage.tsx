import FadeInUp from 'components/easthotels/Animation/FadeInUp';
import React from 'react';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import Typography from 'components/easthotels/Typography/Typography';
import RichTextTypography from 'components/easthotels/Typography/RichTextTypography';
import { TwoColumnImageProps } from '@/props/PageContent/TwoColumnImageProps';
import {
  withDatasourceCheck,
  Image as ScImage,
  Text as ScText,
  RichText as ScRichText,
} from '@sitecore-jss/sitecore-jss-nextjs';
import ComponentError from '../Error/ComponentError';
import { cn } from 'lib/utils';

const Default = (twoColumnImageProps: TwoColumnImageProps) => {
  try {
    const sitecoreCss = twoColumnImageProps.params?.Styles ?? '';

    const mdContainerCss = sitecoreCss.includes('md-container')
      ? ' medium-section-container lg:!max-w-[1440px]'
      : ' small-section-container';

    const smallerWidthCss = sitecoreCss.includes('SmallerWidth') ? 'lg:max-w-[1000px]' : '';

    return (
      <div className={'mx-[15px] flex justify-center lg:mx-[50px]'}>
        <div
          className={cn(
            'small-section-container grid place-content-center gap-[40px] lg:grid-cols-2',
            sitecoreCss,
            mdContainerCss,
            smallerWidthCss
          )}
        >
          <FadeInUp wrapperClassName="h-fit" scrollY={[0.5, 1]}>
            <div className="w-full">
              <ScImage
                field={twoColumnImageProps.fields.LeftImage}
                class="w-full object-cover lg:w-[50vw]"
              />
              {/* <div style={{ maxWidth: ~~leftImageWidth }}> */}
              <div className="mt-[15px] w-full">
                <Typography variant="h4">
                  <ScText field={twoColumnImageProps.fields.LeftTitle} />
                </Typography>
              </div>
              <div className="my-[20px]">
                <RichTextTypography>
                  <ScRichText field={twoColumnImageProps.fields.LeftContent} />
                </RichTextTypography>
              </div>
              {/* </div> */}
            </div>
          </FadeInUp>
          <FadeInUp scrollY={[0.2, 0.8]}>
            <div className=" w-full">
              <ScImage
                field={twoColumnImageProps.fields.RightImage}
                class="w-full object-cover lg:w-[50vw]"
              />
              {/* <div style={{ maxWidth: ~~rightImageWidth }}> */}
              <div className="mt-[15px]">
                <Typography variant="h4">
                  <ScText field={twoColumnImageProps.fields.RightTitle} />
                </Typography>
              </div>
              <div className="my-[20px]">
                <RichTextTypography>
                  <ScRichText field={twoColumnImageProps.fields.RightContent} />
                </RichTextTypography>
              </div>
              {/* </div> */}
            </div>
          </FadeInUp>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default withDatasourceCheck()<TwoColumnImageProps>(Default);
