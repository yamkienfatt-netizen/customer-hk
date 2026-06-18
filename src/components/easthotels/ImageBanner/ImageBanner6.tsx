import { ImageBanner6Props } from '@/props/Media/ImageBannerProps';
import FadeInUp from 'components/easthotels/Animation/FadeInUp';
import CTAButton from 'components/easthotels/Button/CTAButton';
import RichTextTypography from 'components/easthotels/Typography/RichTextTypography';
import Typography from 'components/easthotels/Typography/Typography';
import React, { JSX } from 'react';
import {
  Image as ScImage,
  Text as ScText,
  RichText as ScRichText,
  useSitecoreContext,
  LayoutServicePageState,
  LinkField,
  TextField,
  withDatasourceCheck,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { SitecoreLink } from '../CustomTypes/Components/SitecoreLink';
import ComponentError from '../Error/ComponentError';

// Component element:
// 1) image, checkbox to control image show on left or right, title, blurb rich text editor, CTA text, CTA link
// interface ImageBanner6Fields {
//   title?: string;
//   description?: string;
//   image: {
//     src: string;
//   };
//   cta?: { url: string; text: string };
//   ImageOnLeft?: boolean;
// }

const ImageBanner6 = (imageBanner6Props: ImageBanner6Props): JSX.Element => {
  try {
    const { sitecoreContext } = useSitecoreContext();
    const isPageEditing = sitecoreContext.pageState === LayoutServicePageState.Edit;
    const ImageOnRight = imageBanner6Props.fields?.ImageOnRight?.value || false;
    const gridClass = ImageOnRight ? 'lg:order-last' : '';
    const imageWidth = imageBanner6Props?.fields?.Image?.value?.width || 590;
    // const noMargin = imageBanner6Props.fields?.NoMargin?.value || false;
    const noMargin = false;
    const CTAButtonSize =
      imageBanner6Props.fields?.BigCTA?.value === true ? 'contained-big' : 'underlined';
    const sitecoreCss = imageBanner6Props.params?.Styles ?? '';

    return (
      <FadeInUp>
        <div className={`${!noMargin && 'mx-[15px] lg:mx-[50px]'}`}>
          <div
            // className={`medium-section-container lg:!max-w-[1440px] ${sitecoreCss}`}
            className={
              `small-section-container grid justify-between gap-[20px] lg:grid-cols-2 lg:gap-[40px] ` +
              sitecoreCss
            }
            style={{
              display: imageBanner6Props?.fields?.MobileAlignCenter ? 'flex' : 'block',
              justifyContent: 'center',
            }}
          >
            <div className="w-full">
              {imageBanner6Props?.fields?.BigHeader.value && (
                <div className="mb-[30px]">
                  <Typography variant="h2" font="Bellefair">
                    <ScText field={imageBanner6Props.fields.BigHeader} />
                  </Typography>
                </div>
              )}
              <div
                // lg:mx-[125px]
                className="grid gap-[22px] lg:grid-cols-2 lg:gap-[40px]"
              >
                <div className={`${gridClass} `}>
                  {isPageEditing ? (
                    <ScImage
                      field={imageBanner6Props.fields?.Image}
                      className={'max-h-[465px] w-full max-w-[700px] object-contain'}
                    />
                  ) : (
                    <SitecoreLink
                      field={imageBanner6Props.fields?.BannerCTAUrl}
                      className="block w-full"
                    >
                      <ScImage
                        //aspect-[345/323] lg:aspect-[590/554]
                        field={imageBanner6Props.fields?.Image}
                        className={'max-h-[465px] w-full max-w-[700px] object-contain'}
                      />
                    </SitecoreLink>
                  )}
                </div>
                {/* <div style={{ maxWidth: ~~imageWidth }}> */}
                <div className="w-full">
                  {(imageBanner6Props.fields?.Heading?.value || isPageEditing) && (
                    <SitecoreLink field={imageBanner6Props.fields?.BannerCTAUrl}>
                      <div className="lg:mt-[40px]">
                        <Typography variant="p" className="font-bold">
                          <ScText field={imageBanner6Props.fields?.Heading} />
                        </Typography>
                      </div>
                    </SitecoreLink>
                  )}
                  {(imageBanner6Props.fields?.Content?.value || isPageEditing) && (
                    <div className="my-[25px]">
                      <RichTextTypography>
                        <ScRichText field={imageBanner6Props.fields?.Content} />
                      </RichTextTypography>
                    </div>
                  )}
                  {(isPageEditing ||
                    imageBanner6Props.fields?.BannerCTAUrl.value.href ||
                    imageBanner6Props.fields?.BannerCTAText.value) && (
                    <div className="flex-start flex">
                      <CTAButton
                        url={imageBanner6Props.fields?.BannerCTAUrl as LinkField}
                        text={imageBanner6Props.fields?.BannerCTAText as TextField}
                        variant={CTAButtonSize}
                        bgColor={CTAButtonSize == 'contained-big' ? 'green-primary' : ''}
                        fontColor={CTAButtonSize == 'contained-big' ? 'white' : 'black-secondary'}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeInUp>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};
export default withDatasourceCheck()<ImageBanner6Props>(ImageBanner6);
