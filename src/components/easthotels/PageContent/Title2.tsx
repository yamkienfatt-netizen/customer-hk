import React, { useRef } from 'react';
import { Title2Prop } from '@/props/PageContent/Title2Prop';
import { useScroll } from 'framer-motion';
import HeaderSection from '../Navigation/HeaderSection';
import FadeInUp from '../Animation/FadeInUp';
import Typography from '../Typography/Typography';
import { Text as ScText, withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import CTAButton from '../Button/CTAButton';
import useWindowSize from 'src/hooks/useWindowSize';
import RichTextTypography from '../Typography/RichTextTypography';
import { RichText as ScRichText, useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';
import ComponentError from '../Error/ComponentError';

const Title2 = (title2Prop: Title2Prop) => {
  try {
    const { isMobile } = useWindowSize();
    const sitecoreCss = title2Prop.params?.Styles ?? '';
    return (
      <div className={'medium-section-container !max-w-[768px] ' + sitecoreCss}>
        <div
          className={`mx-[15px] flex flex-col ${isMobile && title2Prop.fields.MobileCenter.value ? 'items-center text-center' : ''} lg:items-center lg:text-center`}
        >
          <div>
            <HeaderSection
              heading1={title2Prop.fields.Heading1}
              heading2={title2Prop.fields.Heading2}
              textVariant="h2"
            />

            {/* {title2Prop.fields.Description.value ||
              title2Prop.fields.BannerCTAUrl.value.href ||
              (title2Prop?.fields?.URL?.value?.href && title2Prop?.fields?.Text?.value && (
                <div className={'mb-[30px]'} />
              ))} */}

            {title2Prop.fields.Description && (
              <RichTextTypography>
                <ScRichText field={title2Prop.fields.Description} />
              </RichTextTypography>
            )}
            {title2Prop.fields.BannerCTAUrl.value.href !== '' && (
              <div className="mx-auto mt-[30px] max-w-[300px] lg:mt-[40px]">
                <CTAButton
                  variant="contained-big"
                  url={title2Prop.fields.BannerCTAUrl}
                  text={title2Prop.fields.BannerCTAText}
                  bgColor="green-primary"
                  fontColor="white"
                ></CTAButton>
              </div>
            )}
            {title2Prop?.fields?.URL?.value?.href && title2Prop?.fields?.Text?.value && (
              <CTAButton
                url={title2Prop?.fields?.URL}
                text={title2Prop?.fields?.Text}
                variant="underlined"
                extraContainerStyles="mt-[30px] lg:mt-[40px] max-w-[300px] mx-auto"
                centerButton={true}
              />
            )}
          </div>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default Title2;
