import { Text, LinkField, useSitecoreContext, TextField } from '@sitecore-jss/sitecore-jss-nextjs';
import React, { ReactNode, useState, forwardRef } from 'react';
import Typography, { TypographyProps } from '../Typography/Typography';
import { motion } from 'framer-motion';
import useDimensions from 'react-cool-dimensions';
import { SitecoreLink } from '../CustomTypes/Components/SitecoreLink';
import ComponentError from '../Error/ComponentError';
import { HtmlLink } from '../CustomTypes/Components/HtmlLink';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GetLocaleUrl } from '@/utilities/LanguageUtilities';
import { useI18n } from 'next-localization';

type CTAButtonProps = {
  url?: LinkField | string;
  text: TextField | string;
  variant?: 'contained-small' | 'contained-big' | 'text' | 'underlined' | 'hovered-underline';
  fontColor?: string;
  bgColor?: string;
  disabled?: boolean;
  isNewWindow?: boolean;
  extraStyles?: string;
  centerButton?: boolean;
  extraContainerStyles?: string;
  flexBtn?: boolean;
  textWithoutTypography?: boolean;
};

const CTAButton = ({
  url,
  text,
  variant = 'text',
  fontColor,
  bgColor,
  disabled = false,
  isNewWindow = false,
  extraStyles,
  centerButton = false,
  extraContainerStyles,
  flexBtn,
  textWithoutTypography = false,
}: CTAButtonProps) => {
  try {
    const { sitecoreContext } = useSitecoreContext();

    const FontStyles = {
      'contained-small': 'font-bold',
      'contained-big': 'text-[14px] leading-[20px] font-bold',
      text: 'font-semiBold',
      // underlined: 'decoration-2 underline underline-offset-4 font-semiBold',
      underlined: 'font-semiBold',
      'hovered-underline':
        'hover:decoration-2 hover:underline hover:underline-offset-4 font-semiBold',
    };

    const ContainerStyles = {
      'contained-small': 'py-[9px] px-[20px] flex items-center justify-center',
      'contained-big': 'py-[9px] px-[20px] flex items-center justify-center',
      text: '',
      underlined: '',
      'hovered-underline': '',
    };

    const fontStyles = `${extraStyles} ${FontStyles[variant] || ''}`;
    const containerStyles = `${ContainerStyles[variant]} ${extraContainerStyles}`;
    const allStyles = `${fontStyles} ${containerStyles}`;

    const [buttonWidth, setButtonWidth] = useState(0);
    const [buttonHeight, setButtonHeight] = useState(0);

    const textMotion = {
      initial: { y: 0, opacity: 1 },
      animate: { y: -buttonHeight, opacity: 0 },
    };
    const oppositeTextMotion = {
      initial: { y: 0, opacity: 1 },
      animate: { y: -buttonHeight, opacity: 1 },
    };
    const underlineMotion = {
      initial: { x: 0, opacity: 1 },
      animate: { x: buttonWidth + 20, opacity: 0 },
    };
    const oppositeUnderlineMotion = {
      initial: { x: -buttonWidth - 20, opacity: 1 },
      animate: { x: 0, opacity: 1 },
    };

    const CTAText = ({ style = fontStyles }) => {
      if (typeof text !== 'string') {
        text = String(text?.value)?.toUpperCase() || '';
      } else {
        text = text?.toUpperCase() || '';
      }
      return (
        <>
          {textWithoutTypography ? (
            <div
              className={`text-[13px] font-bold leading-[18px] tracking-[0.88px] ${style}`}
              style={{ color: fontColor }}
            >
              {text}
            </div>
          ) : (
            <Typography
              variant="l1"
              fontWeight="bold"
              fontColor={fontColor}
              extraStyles={`${style}`}
            >
              {typeof text === 'string' ? text : <Text field={text as TextField} />}
            </Typography>
          )}
        </>
      );
    };

    const Underline = ({ motionVariant }) => {
      return (
        <motion.div
          variants={motionVariant}
          transition={{
            ease: 'linear',
            x: { duration: 0.3 },
          }}
          className="mt-[-2px] bg-black-secondary"
          style={{
            backgroundColor: fontColor,
            height: '2px',
          }}
        />
      );
    };

    const CTAContent = ({}) => {
      const { observe, unobserve, width, height, entry } = useDimensions({
        onResize: ({ observe, unobserve, width, height, entry }) => {
          // Triggered whenever the size of the target is changed...
          setButtonWidth(width);
          setButtonHeight(height);

          unobserve(); // To stop observing the current target element
          observe(); // To re-start observing the current target element
        },
      });

      return (
        <motion.div
          initial="initial"
          animate="initial"
          whileHover="animate"
          className={`${bgColor && `bg-${bgColor}`} ${containerStyles}`}
        >
          <div className={`relative overflow-hidden`} ref={observe}>
            <motion.div
              variants={textMotion}
              transition={{
                ease: 'linear',
                y: { duration: 0.2 },
              }}
            >
              <CTAText style={fontStyles} />
            </motion.div>
            {variant == 'underlined' && (
              <>
                <Underline motionVariant={underlineMotion} />
                <Underline motionVariant={oppositeUnderlineMotion} />
              </>
            )}
            <motion.div
              variants={oppositeTextMotion}
              className="absolute"
              style={{ width: buttonWidth, bottom: -buttonHeight }}
              transition={{
                ease: 'linear',
                y: { duration: 0.2 },
              }}
            >
              <CTAText style={fontStyles} />
            </motion.div>
          </div>
        </motion.div>
      );
    };

    const router = useRouter();
    const { t, locale } = useI18n();

    return (
      <div
        className={`${variant == 'underlined' || flexBtn ? 'flex' : ''}  ${variant == 'underlined' && centerButton ? 'justify-center' : ''}`}
      >
        <div className={`${bgColor && `bg-${bgColor}`}`}>
          {disabled ? (
            <CTAContent />
          ) : (
            <>
              {/* fallback for new components  */}
              {typeof url === 'string' ? (
                <HtmlLink href={url} target={isNewWindow ? '_blank' : '_self'}>
                  <CTAContent />
                </HtmlLink>
              ) : (
                // <SitecoreLink field={url as LinkField} editable={sitecoreContext.pageEditing}>
                <Link
                  href={url?.value?.href || ''}
                  onClick={(e) => {
                    if (url?.value?.href?.includes('mailto')) {
                      return;
                    }
                    e.preventDefault();
                    window.location.href = GetLocaleUrl(url?.value?.href || '', locale());
                  }}
                >
                  <CTAContent />
                </Link>
                // </SitecoreLink>
              )}
            </>
          )}
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default CTAButton;
