import React from 'react';
import FadeInUp from 'components/easthotels/Animation/FadeInUp';
import HeaderSection from 'components/easthotels/Navigation/HeaderSection';
import Typography from 'components/easthotels/Typography/Typography';
import CTAButton from 'components/easthotels/Button/CTAButton';
import {
  withDatasourceCheck,
  Image as ScImage,
  Text as ScText,
  TextField,
  LinkField,
  useSitecoreContext,
  LayoutServicePageState,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { ImageBanner7Props } from '@/props/Media/ImageBannerProps';
import { SitecoreLink } from '../CustomTypes/Components/SitecoreLink';
import ComponentError from '../Error/ComponentError';
import useWindowSize from '@/hooks/useWindowSize';
import { cn } from 'lib/utils';

const Default = (imageBanner7Props: ImageBanner7Props) => {
  try {
    const context = useSitecoreContext();
    const isPageEditing = context.sitecoreContext.pageState === LayoutServicePageState.Edit;
    const ImageOnRight = imageBanner7Props?.fields?.ImageOnRight?.value;
    const imageWidth = imageBanner7Props?.fields?.Image?.value?.width || 590;
    const sitecoreCss = imageBanner7Props.params?.Styles ?? '';
    const { isDesktop } = useWindowSize();
    return (
      <FadeInUp>
        <div className="mx-[15px] lg:mx-[50px]">
          <div
            className={
              `small-section-container grid justify-center gap-[20px] lg:grid-cols-2 lg:gap-[40px] ` +
              sitecoreCss
            }
          >
            {/* aspect-[345/332] lg:aspect-[590/570] */}
            <div
              className={cn(' h-auto w-auto lg:max-w-[590px]', { 'lg:order-last': ImageOnRight })}
            >
              {isPageEditing ? (
                <ScImage
                  field={imageBanner7Props.fields.Image}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <SitecoreLink field={imageBanner7Props.fields.BannerCTAUrl}>
                  <ScImage
                    field={imageBanner7Props.fields.Image}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </SitecoreLink>
              )}
            </div>

            {/* <div className="mt-[20px] max-w-[345px] lg:mt-[30px] lg:max-w-[610px]"> */}
            <div
              style={
                imageBanner7Props.params?.Styles?.includes('notAlignWithImgWidth') || isDesktop
                  ? {}
                  : { maxWidth: ~~imageWidth }
              }
              className="lg:mt-[40px]"
            >
              {(isPageEditing ||
                imageBanner7Props.fields.Heading ||
                imageBanner7Props.fields.Subheading) && (
                <HeaderSection
                  heading1={imageBanner7Props.fields.Heading as TextField}
                  heading2={imageBanner7Props.fields.Subheading as TextField}
                  textVariant="h2"
                />
              )}
              {(isPageEditing || imageBanner7Props.fields.Description) && (
                <div className="mb-[25px] mt-[20px] lg:mb-[30px] lg:mt-[80px]">
                  <Typography variant="p">
                    <ScText field={imageBanner7Props.fields.Description} />
                  </Typography>
                </div>
              )}
              {(isPageEditing || imageBanner7Props.fields.BannerCTAUrl.value.href) && (
                <CTAButton
                  url={imageBanner7Props.fields.BannerCTAUrl as LinkField}
                  text={imageBanner7Props.fields.BannerCTAText as TextField}
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

export default withDatasourceCheck()<ImageBanner7Props>(Default);
