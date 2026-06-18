import React from 'react';
import Typography from '../Typography/Typography';
import CTAButton from '../Button/CTAButton';
import {
  TextField,
  Text as ScText,
  RichText as ScRichText,
  LinkField,
  RichTextField,
  LayoutServicePageState,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { _BannerWithCta } from '@/props/common/_BannerWithCta';
import { _MultiHeadingBanner } from '@/props/common/_MultiHeadingBanner';
import RichTextTypography from '../Typography/RichTextTypography';
import ComponentError from '../Error/ComponentError';

const BannerTextSectionContent = ({
  Subheading,
  Description,
  BannerCTAUrl,
  BannerCTAText,
  ctaButtonSize = 'small',
  filledCTAClassName = '',
  showCTABtn = true,
  fontColor,
  centerButton = false,
  flexCTABtn,
  isDescriptionRichText = false,
}: {
  Subheading: TextField;
  Description: TextField | RichTextField;
  BannerCTAUrl: LinkField;
  BannerCTAText: TextField;
  ctaButtonSize?: 'small' | 'large';
  filledCTAClassName?: string;
  showCTABtn?: boolean;
  fontColor?: string;
  centerButton?: boolean;
  flexCTABtn?: boolean;
  isDescriptionRichText?: boolean;
}) => {
  try {
    const { sitecoreContext } = useSitecoreContext();
    const isPageEditing = sitecoreContext.pageState === LayoutServicePageState.Edit;

    return (
      <div className={` flex h-full flex-col justify-between lg:max-w-[580px] text-${fontColor}`}>
        {/* added fall back for components not converted to sitecore */}
        {Subheading && typeof Subheading === 'string' ? (
          <div className="mb-[20px]">
            <Typography variant="h4">{Subheading}</Typography>
          </div>
        ) : (
          Subheading?.value && (
            <div className="mb-[20px]">
              <Typography variant="h4">
                <ScText field={Subheading} />
              </Typography>
            </div>
          )
        )}
        {typeof Description === 'string' ? (
          <>
            <RichTextTypography>{Description}</RichTextTypography>
          </>
        ) : isDescriptionRichText ? (
          <RichTextTypography>
            <ScRichText field={Description as RichTextField} />
          </RichTextTypography>
        ) : (
          <Typography variant="p">
            <ScText field={Description} />
          </Typography>
        )}

        <div className={`pt-[30px] ${ctaButtonSize == 'large' ? 'lg:pt-[30px]' : 'lg:pt-[40px]'} `}>
          {!isPageEditing && BannerCTAText?.value && showCTABtn && (
            <CTAButton
              variant={ctaButtonSize === 'small' ? 'underlined' : 'contained-small'}
              url={BannerCTAUrl}
              text={BannerCTAText as TextField}
              fontColor={fontColor ? fontColor : ctaButtonSize === 'large' ? 'white' : ''}
              extraContainerStyles={filledCTAClassName}
              centerButton={centerButton}
              bgColor={ctaButtonSize === 'large' ? 'green-primary' : ''}
              flexBtn={flexCTABtn}
            />
          )}
        </div>

        {isPageEditing && (
          <div
            className={`pt-[30px] ${ctaButtonSize == 'large' ? 'lg:pt-[30px]' : 'lg:pt-[40px]'} `}
          >
            {showCTABtn && BannerCTAText?.value && (
              <CTAButton
                variant={ctaButtonSize === 'small' ? 'underlined' : 'contained-small'}
                url={BannerCTAUrl}
                text={BannerCTAText as TextField}
                fontColor={fontColor ? fontColor : ctaButtonSize === 'large' ? 'white' : ''}
                extraContainerStyles={filledCTAClassName}
                centerButton={centerButton}
                bgColor={ctaButtonSize === 'large' ? 'green-primary' : ''}
                flexBtn={flexCTABtn}
              />
            )}
          </div>
        )}
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default BannerTextSectionContent;
