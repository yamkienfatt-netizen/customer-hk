import React from 'react';
import FadeInUp from 'components/easthotels/Animation/FadeInUp';
import HeaderSection from 'components/easthotels/Navigation/HeaderSection';
import Typography from 'components/easthotels/Typography/Typography';
import CTAButton from 'components/easthotels/Button/CTAButton';
import {
  Image as ScImage,
  Text as ScText,
  RichText as ScRichText,
  TextField,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { ImageBanner13Props } from '@/props/Media/ImageBannerProps';

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const ImageBanner13 = (imageBanner13Props: ImageBanner13Props) => {
  const sitecoreCss = imageBanner13Props.params?.Styles ?? '';

  return (
    <div
      // lg:py-[30px]
      className={`medium-section-container__lg-only flex flex-col items-center lg:flex-row lg:items-start ${sitecoreCss}`}
    >
      {/* lg:mt-[30px] */}
      <div className="mx-[15px] flex max-w-[540px] basis-full flex-col lg:ml-[50px] lg:mr-[30px]  lg:max-w-[360px]">
        <HeaderSection
          heading1={imageBanner13Props.fields.Heading1}
          heading2={imageBanner13Props.fields.Heading2}
          className=""
          textVariant={'h2'}
        />
        <Typography variant="p" className={'mb-[30px]'}>
          <ScRichText field={imageBanner13Props.fields.Description} />
        </Typography>
        <CTAButton
          url={imageBanner13Props.fields.BannerCTAUrl as LinkField}
          text={imageBanner13Props.fields.BannerCTAText as TextField}
          variant="underlined"
        />
      </div>

      <div
        className={
          'mt-10 flex h-full w-full justify-between gap-4 lg:mr-[50px] lg:mt-0 lg:flex-row-reverse lg:gap-[30px]'
        }
      >
        {/* basis-[43.2%] */}
        <FadeInUp wrapperClassName="mt-auto aspect-square basis-[42.8%]">
          <ScImage
            field={imageBanner13Props.fields.Image1}
            className={'aspect-square h-full w-full object-cover'}
            srcSet={[{ mw: 407 }, { mw: 232 }]}
            sizes="(min-width: 992px) 407px, 232px"
          />
        </FadeInUp>
        <FadeInUp wrapperClassName={'basis-[52.3%]'}>
          <ScImage
            field={imageBanner13Props.fields.Image2}
            className={'aspect-[0.9] h-full w-full object-cover'}
            srcSet={[{ mw: 497 }, { mw: 283 }]}
            sizes="(min-width: 992px) 497px, 283px"
          />
        </FadeInUp>
      </div>
    </div>
  );
};

export default ImageBanner13;
