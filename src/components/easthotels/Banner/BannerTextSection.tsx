import React, { useRef } from 'react';
import FadeInUp from '../Animation/FadeInUp';
import FadeInLeftToRight from '../Animation/FadeInLeftToRight';
import Typography from '../Typography/Typography';
import { useScroll } from 'framer-motion';
import { LinkField, RichTextField, Text, TextField } from '@sitecore-jss/sitecore-jss-nextjs';
import { _BannerWithCta } from '@/props/common/_BannerWithCta';
import BannerTextSectionContent from './BannerTextSectionContent';
import BannerTextSectionHeader from './BannerTextSectionHeader';
import ComponentError from '../Error/ComponentError';

const BannerTextSection = ({
  Heading,
  Subheading,
  Description,
  BannerCTAUrl,
  BannerCTAText,
  animationType,
  headerVariant = 'h1',
  headerPaddingBtm,
  ctaButtonSize = 'small',
  filledCTAClassName = '',
  showCTABtn = true,
  isDescriptionRichText = false
}: {
  Heading?: TextField;
  Subheading?: TextField;
  Description?: TextField | RichTextField;
  BannerCTAUrl?: LinkField;
  BannerCTAText?: TextField;
  animationType?: 'fadeinup' | 'fadeinLeftToRight';
  headerVariant?: string;
  headerPaddingBtm?: number;
  ctaButtonSize?: 'small' | 'large';
  filledCTAClassName?: string;
  showCTABtn?: boolean;
  isDescriptionRichText?: boolean;
}) => {
  try {
    const AnimationComponent = animationType === 'fadeinLeftToRight' ? FadeInLeftToRight : FadeInUp;

    return (
      <div>
        {/* {Heading && (
          <div
            style={{ paddingBottom: headerPaddingBtm }}
            className={`${!headerPaddingBtm && headerVariant == 'h1' ? 'pb-[60px] lg:pb-[80px]' : !headerPaddingBtm && 'pb-[30px] lg:pb-[40px]'}`}
          >
            <AnimationComponent>
              <Typography variant={headerVariant} font="Bellefair">
                <Text field={Heading} />
              </Typography>
            </AnimationComponent>
          </div>
        )} */}
        <BannerTextSectionHeader
          Heading={Heading}
          animationType={animationType}
          headerVariant={headerVariant}
          headerPaddingBtm={headerPaddingBtm}
        />
        <div className="lg:max-w-[580px]">
          <AnimationComponent>
            <BannerTextSectionContent
              Subheading={Subheading as TextField}
              Description={Description as TextField}
              BannerCTAUrl={BannerCTAUrl as LinkField}
              BannerCTAText={BannerCTAText as TextField}
              ctaButtonSize={ctaButtonSize}
              filledCTAClassName={filledCTAClassName}
              showCTABtn={showCTABtn}
              isDescriptionRichText={isDescriptionRichText}
            />
          </AnimationComponent>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />
  }
};

export default BannerTextSection;
