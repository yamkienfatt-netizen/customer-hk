import React, { useRef, useState } from 'react';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import FadeInUp from 'components/easthotels/Animation/FadeInUp';
import HeaderSection from 'components/easthotels/Navigation/HeaderSection';
import Typography from 'components/easthotels/Typography/Typography';
import { ImageBanner8Props } from '@/props/Media/ImageBannerProps';
import CTAButton from '../Button/CTAButton';
import {
  LayoutServicePageState,
  useSitecoreContext,
  Text as ScText,
  RichText as ScRichText,
  Image as ScImage,
  withDatasourceCheck,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { SitecoreLink } from '../CustomTypes/Components/SitecoreLink';
import ComponentError from '../Error/ComponentError';
import useWindowSize from '@/hooks/useWindowSize';
import { cn } from 'lib/utils';

const Default = (imageBanner8Props: ImageBanner8Props) => {
  try {
    const { sitecoreContext } = useSitecoreContext();
    const { isMobile } = useWindowSize();
    const isPageEditing = sitecoreContext.pageState === LayoutServicePageState.Edit;

    const gridClass = imageBanner8Props.fields?.ImageOnRight?.value || false ? 'lg:order-last' : '';
    // check box from sitecore
    const CTAButtonSize = 'large';
    const sitecoreCss = imageBanner8Props.params?.Styles ?? '';
    const isMobileFixedCta = imageBanner8Props.params?.Styles?.includes('mobileFixedCtaBtn');

    return (
      <div
        style={
          sitecoreCss.includes('mobile-mt0') && isMobile ? { marginTop: '0px !important' } : {}
        }
        className={'medium-section-container ' + sitecoreCss}
      >
        <div className={`flex flex-col justify-center gap-[40px] lg:flex-row lg:gap-[50px]`}>
          <div className={`${gridClass} relative h-auto w-full lg:max-w-[650px]`}>
            <SitecoreLink field={imageBanner8Props.fields.BannerCTAUrl}>
              <ScImage
                field={imageBanner8Props.fields.Image}
                className="aspect-[4/3] w-full object-cover lg:absolute lg:inset-0 lg:aspect-auto lg:h-full"
              />
            </SitecoreLink>
          </div>
          <div className="mx-[15px] lg:mx-0 lg:mt-[30px] lg:max-w-[580px]">
            {(isPageEditing ||
              imageBanner8Props.fields.Heading1 ||
              imageBanner8Props.fields.Heading2) && (
                <HeaderSection
                  heading1={imageBanner8Props.fields.Heading1}
                  heading2={imageBanner8Props.fields.Heading2}
                  textVariant="inner-h1"
                />
              )}
            {(isPageEditing || imageBanner8Props.fields.Subheading) && (
              <div className="lg:mt-[168px]">
                <Typography variant="h4">
                  <ScText field={imageBanner8Props.fields.Subheading} />
                </Typography>
              </div>
            )}
            {(isPageEditing || imageBanner8Props.fields.Description) && (
              <div className="mt-[20px] lg:mt-[30px]">
                <Typography variant="p">
                  <ScRichText field={imageBanner8Props.fields.Description} />
                </Typography>
              </div>
            )}
            {(isPageEditing || imageBanner8Props.fields.BannerCTAText.value !== '') && (
              <div
                className={cn(
                  'mt-[20px] lg:mt-[30px] lg:w-[300px]',
                  isMobileFixedCta ? 'fixed bottom-0 left-0 z-20 w-full lg:relative lg:z-0' : ''
                )}
              >
                <CTAButton
                  url={imageBanner8Props.fields.BannerCTAUrl}
                  text={imageBanner8Props.fields.BannerCTAText}
                  variant={CTAButtonSize === 'large' ? 'contained-big' : 'underlined'}
                  bgColor={CTAButtonSize === 'large' ? 'green-primary' : ''}
                  fontColor={CTAButtonSize === 'large' ? 'white' : ''}
                  extraContainerStyles={
                    isMobileFixedCta && isMobile
                      ? 'bg-royal-green lg:bg-green-primary min-h-[50px]'
                      : ''
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default withDatasourceCheck()<ImageBanner8Props>(Default);
