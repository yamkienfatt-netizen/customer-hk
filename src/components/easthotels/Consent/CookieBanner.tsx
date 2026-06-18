import React, { useState, useEffect } from 'react';
import Typography from '../Typography/Typography';
import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import CTAButton from 'components/easthotels/Button/CTAButton';
import { animate, motion } from 'framer-motion';
import useWindowSize from '@/hooks/useWindowSize';
import { CookieBannerProps } from '@/props/Consent/CookieBanner';
import ComponentError from '../Error/ComponentError';
import { Text as ScText, RichText as ScRichText } from '@sitecore-jss/sitecore-jss-nextjs';
import RichTextTypography from 'components/easthotels/Typography/RichTextTypography';
import Cookies from 'js-cookie';
import { cn } from 'lib/utils';

const CookieBanner = ({
  cookieConsentContent,
  cookieConsentVisible,
  cookieConsentButton,
  cookieConsentExpireDays,
}: {
  cookieConsentContent: string;
  cookieConsentVisible: boolean;
  cookieConsentButton: string;
  cookieConsentExpireDays: number;
}) => {
  try {
    const { t, locale } = useI18n();
    const { isMobile } = useWindowSize();
    const [showCookieBanner, setShowCookieBanner] = useState(false);

    const cookieBannerMotion = {
      initial: {
        height: 'auto',
      },
      animate: {
        height: 0,
        padding: 0,
      },
    };

    useEffect(() => {
      // if (sessionStorage.getItem('consentCookie') === 'true') {
      if (Cookies.get('consentCookie') === 'true') {
        setShowCookieBanner(false);
      } else {
        setShowCookieBanner(true);
      }
    }, []);

    if (!cookieConsentVisible) {
      return <></>;
    }

    const rewriteHTML = (html: string) => {
      let rewriteContent = html.includes('<a')
        ? html
            .replaceAll('<a', '<span style="text-decoration: underline;"><a')
            .replaceAll('</a>', '</a></span>')
        : html;

      return rewriteContent;
    };
    const newLayout = true;

    return (
      <motion.div
        className={cn(
          !newLayout &&
            'overflow-hidden fixed bottom-0 z-50 flex w-full flex-wrap items-center justify-center space-y-6 bg-[#616749] py-[5%] lg:space-x-[3%] lg:space-y-0 lg:px-0 lg:py-[2%]',
          newLayout &&
            'overflow-hidden w-[calc(100% - 40px)] fixed bottom-[20px] z-50 mx-[20px] flex max-w-[480px] flex-wrap items-center justify-center space-y-6 bg-[#616749] p-[20px] opacity-90'
        )}
        animate={showCookieBanner ? 'initial' : 'animate'}
        initial="initial"
        variants={cookieBannerMotion}
        transition={{
          ease: 'linear',
          duration: 0.2,
        }}
      >
        <div className={cn(!newLayout && 'w-[80%] lg:w-[60%]', newLayout && 'w-full')}>
          <div
            className="font-[Amiko] text-[16px] leading-[21px] text-white"
            dangerouslySetInnerHTML={{ __html: rewriteHTML(cookieConsentContent) }}
          ></div>
        </div>
        <div
          className="lg:w-atuo hover:cursor-pointer"
          onClick={() => {
            // sessionStorage.setItem('consentCookie', 'true');
            Cookies.set('consentCookie', 'true', { expires: cookieConsentExpireDays });
            setShowCookieBanner(false);
          }}
        >
          <CTAButton
            text={cookieConsentButton}
            disabled
            variant="contained-small"
            fontColor="#828077"
            bgColor="white"
            extraContainerStyles={'min-w-[190px] min-h-[40px]'}
            textWithoutTypography
          />
        </div>
      </motion.div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default CookieBanner;
