import React, { useRef } from 'react';
import Typography from '../Typography/Typography';
import { useScroll } from 'framer-motion';
import FadeInUp from '../Animation/FadeInUp';
import FadeInLeftToRight from '../Animation/FadeInLeftToRight';
import { TextField, Text as ScText } from '@sitecore-jss/sitecore-jss-nextjs';
import ComponentError from '../Error/ComponentError';

const HeaderSection = ({
  heading1,
  heading2,
  className,
  animationType = 'fadeInUp',
  textVariant = 'h1',
  removeMarginBottom = false,
}: {
  heading1: TextField | string;
  heading2: TextField | string;
  className?: string;
  animationType?: string;
  textVariant?: string;
  removeMarginBottom?: boolean;
}) => {
  try {
    const AnimationComponent = animationType === 'fadeinLeftToRight' ? FadeInLeftToRight : FadeInUp;

    if (typeof heading1 !== 'string' && heading1?.value) {
      String((heading1.value = heading1?.value))?.toUpperCase() || '';
    }

    if (typeof heading2 !== 'string' && heading2?.value) {
      String((heading2.value = heading2?.value))?.toUpperCase() || '';
    }

    return (
      <div className={`${removeMarginBottom ? '' : 'mb-[30px]'} `}>
        <AnimationComponent className={`${className}`}>
          {/* Todo: Need to remove this fallback solution after all referenced components converted to Sitecore component */}
          {/* A fallback for new component */}
          {typeof heading1 === 'string' && (
            <Typography variant={textVariant}>
              {heading1?.toUpperCase() || ('' as string)}
            </Typography>
          )}
          {typeof heading2 === 'string' && (
            <Typography variant={textVariant} font="Bellefair">
              {heading2?.toUpperCase() || ('' as string)}
            </Typography>
          )}

          {/* This is the actual implementation for components converted to Sitecore components */}
          {heading1?.value && (
            <Typography variant={textVariant} extraStyles="break-words hyphens-auto">
              <ScText field={heading1 as TextField} />
            </Typography>
          )}

          {heading2.value && (
            <Typography
              variant={textVariant}
              font="Bellefair"
              fontWeight="extralight"
              extraStyles="break-words hyphens-auto"
            >
              <ScText field={heading2 as TextField} />
            </Typography>
          )}
        </AnimationComponent>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default HeaderSection;
