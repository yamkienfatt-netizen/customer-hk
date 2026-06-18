import React, { useRef } from 'react';
import FadeInUp from '../Animation/FadeInUp';
import FadeInLeftToRight from '../Animation/FadeInLeftToRight';
import Typography from '../Typography/Typography';
import { useScroll } from 'framer-motion';
import { LinkField, Text, TextField } from '@sitecore-jss/sitecore-jss-nextjs';
import { _BannerWithCta } from '@/props/common/_BannerWithCta';
import BannerTextSectionContent from './BannerTextSectionContent';
import ComponentError from '../Error/ComponentError';

const BannerTextSectionHeader = ({
  Heading,
  animationType,
  headerVariant = 'h1',
  headerPaddingBtm,
}: {
  Heading?: TextField;
  animationType?: 'fadeinup' | 'fadeinLeftToRight';
  headerVariant?: string;
  headerPaddingBtm?: number;
}) => {
  try {
    const AnimationComponent = animationType === 'fadeinLeftToRight' ? FadeInLeftToRight : FadeInUp;

    return (
      <div>
        {Heading && (
          <div
            style={{ paddingBottom: headerPaddingBtm }}
            className={`${!headerPaddingBtm && headerVariant == 'h1' ? 'pb-[60px] lg:pb-[80px]' : !headerPaddingBtm && 'pb-[30px] lg:pb-[40px]'}`}
          >
            <AnimationComponent>
              <Typography variant={headerVariant} font="Bellefair">
                <Text field={Heading} />
              </Typography>
              {/* <HeaderSection heading1="" heading2={Heading} /> */}
            </AnimationComponent>
          </div>
        )}
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />
  }


};

export default BannerTextSectionHeader;
