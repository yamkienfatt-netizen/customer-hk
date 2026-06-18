import React from 'react';
import FadeInUp from 'components/easthotels/Animation/FadeInUp';
import HeaderSection from 'components/easthotels/Navigation/HeaderSection';
import Typography from 'components/easthotels/Typography/Typography';
import CTAButton from 'components/easthotels/Button/CTAButton';
import {
  Image as ScImage,
  Text as ScText,
  RichText as ScRichText,
  TextField,
  LinkField,
  useSitecoreContext,
  LayoutServicePageState,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { ImageBanner12Props } from '@/props/Media/ImageBannerProps';
import RichTextTypography from '../Typography/RichTextTypography';
import { SitecoreLink } from '../CustomTypes/Components/SitecoreLink';
import ComponentError from '../Error/ComponentError';

const ImageBanner12 = (imageBanner12Props: ImageBanner12Props) => {
  try {
    const context = useSitecoreContext();
    const isPageEditing = context.sitecoreContext.pageState === LayoutServicePageState.Edit;
    const imageWidth = imageBanner12Props?.fields?.Image?.value?.width || 590;
    const sitecoreCss = imageBanner12Props.params?.Styles ?? '';
    return (
      <FadeInUp>
        <div className="mx-[15px] lg:mx-[50px]">
          <div
            className={
              `medium-section-container mx-auto grid justify-center lg:!max-w-[1440px] lg:grid-cols-2 lg:gap-[40px]` +
              sitecoreCss
            }
          >
            {(isPageEditing ||
              imageBanner12Props.fields.Heading ||
              imageBanner12Props.fields.Subheading) && (
              <div className="lg:hidden">
                <HeaderSection
                  heading1={imageBanner12Props.fields.Heading as TextField}
                  heading2={imageBanner12Props.fields.Subheading as TextField}
                  textVariant="h2"
                />
              </div>
            )}

            <div>
              {isPageEditing ? (
                <ScImage field={imageBanner12Props.fields.Image} style={{ width: 590 }} />
              ) : (
                <SitecoreLink field={imageBanner12Props.fields.BannerCTAUrl}>
                  <ScImage
                    field={imageBanner12Props.fields.Image}
                    // style={{ width: 590 }}
                    className={'h-full w-full'}
                  />
                </SitecoreLink>
              )}
            </div>

            <div style={{ maxWidth: ~~imageWidth }} className="lg:py-[30px]">
              {(isPageEditing ||
                imageBanner12Props.fields.Heading ||
                imageBanner12Props.fields.Subheading) && (
                <div className="hidden lg:block">
                  <HeaderSection
                    heading1={imageBanner12Props.fields.Heading as TextField}
                    heading2={imageBanner12Props.fields.Subheading as TextField}
                    textVariant="h2"
                  />
                </div>
              )}
              {imageBanner12Props.fields.Description && (
                <div className="mt-[20px] lg:mt-[50px]">
                  <Typography variant="h4">
                    <ScText field={imageBanner12Props.fields.Description} />
                  </Typography>
                </div>
              )}
              {(isPageEditing || imageBanner12Props.fields.Content) && (
                <div className="mt-[20px] lg:mt-[30px]">
                  <RichTextTypography>
                    <ScRichText field={imageBanner12Props.fields.Content} />
                  </RichTextTypography>
                </div>
              )}
              {(isPageEditing || imageBanner12Props.fields.BannerCTAUrl.value.href) && (
                <CTAButton
                  url={imageBanner12Props.fields.BannerCTAUrl as LinkField}
                  text={imageBanner12Props.fields.BannerCTAText as TextField}
                  variant="underlined"
                />
              )}
            </div>
          </div>
        </div>
      </FadeInUp>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default ImageBanner12;
