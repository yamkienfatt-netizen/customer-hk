import React, { JSX } from 'react';
import { PillarBannerProps } from '@/props/media/PillarBannerProps';
import ImageRevealAnimation from '../Animation/ImageRevealAnimation';
import { _BannerWithCta } from '@/props/common/_BannerWithCta';
import Typography from 'components/easthotels/Typography/Typography';
import { Text as ScText, withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import RichTextTypography from 'components/easthotels/Typography/RichTextTypography';
import CTAButton from 'components/easthotels/Button/CTAButton';
import FadeInUp from 'components/easthotels/Animation/FadeInUp';
import ComponentError from '../Error/ComponentError';

const Default = (pillarBannerData: PillarBannerProps): JSX.Element => {
  try {
    const sitecoreCss = pillarBannerData.params?.Styles ?? '';
    return (
      <div className={'small-section-container relativen  ' + sitecoreCss}>
        <div className="flex flex-col justify-between overflow-hidden lg:flex-row">
          <>
            {/* <div className="mb-[60px] ml-[15px] lg:hidden">
              <ImageRevealAnimation
                scImage={pillarBannerData.fields?.RightImage}
                className="w-[250px] lg:h-full lg:w-full"
              />
            </div>
            <div className="flex justify-end">
              <ImageRevealAnimation
                scImage={pillarBannerData.fields?.LeftImage}
                className="w-[300px] aspect-square max-w-[300px]"
              />
            </div> */}
            <div className="aspect-square w-[84%] self-end lg:h-full lg:max-w-[300px] lg:self-auto">
              <ImageRevealAnimation scImage={pillarBannerData.fields?.LeftImage} className="" />
            </div>
            <div className="mx-[15px] my-[60px] flex lg:my-0 lg:items-center lg:justify-center">
              <FadeInUp>
                <div className="lg:max-w-unset max-w-[540px]">
                  <div className="mb-[20px]">
                    <Typography variant="h2" font="Bellefair">
                      <ScText field={pillarBannerData.fields.Subheading} />
                    </Typography>
                  </div>
                  <div className="pb-[30px] lg:pb-[40px]">
                    <RichTextTypography>
                      <ScText field={pillarBannerData.fields.Description} />
                    </RichTextTypography>
                  </div>
                  <CTAButton
                    url={pillarBannerData.fields.BannerCTAUrl}
                    text={pillarBannerData.fields.BannerCTAText}
                    variant="underlined"
                  />
                </div>
              </FadeInUp>
            </div>
            <div className="hidden lg:mt-[160px] lg:block">
              <ImageRevealAnimation
                scImage={pillarBannerData.fields?.RightImage}
                className="aspect-square w-[250px] max-w-[250px]"
              />
            </div>
          </>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default withDatasourceCheck()<PillarBannerProps>(Default);
