import React, { JSX } from 'react';
import { PillarBanner4Props } from '@/props/media/PillarBannerProps';
import { Image, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';
import FadeInUp from '../Animation/FadeInUp';
import FadeInDown from '../Animation/FadeInDown';
import ImageRevealAnimation from '../Animation/ImageRevealAnimation';
import { ComponentProps } from 'lib/component-props';
import HeaderSection from 'components/easthotels/Navigation/HeaderSection';
import BannerTextSectionContent from 'components/easthotels/Banner/BannerTextSectionContent';
import ComponentError from '../Error/ComponentError';

type PillarBanner4EditFrameProp = ComponentProps & PillarBanner4Props;

const FadeInImage = ({ image, marginTop }: { image: ImageField; marginTop: string }) => {
  const FadeInComponent = marginTop === '40px' ? FadeInDown : FadeInUp;

  return (
    <div style={{ marginTop }}>
      <FadeInComponent>
        {/* min-h-[337px] min-w-[236px] */}
        <Image
          field={image}
          className="aspect-[0.7] w-[236px] object-cover"
          srcSet={[{ mw: 236 }]}
          sizes="236px"
        />
      </FadeInComponent>
    </div>
  );
};

export const Default = (pillarBanner4Prop: PillarBanner4EditFrameProp): JSX.Element => {
  try {
    const marginPattern1 = [40, 70, 40, 70, 40, 90, 30, 40];
    const marginPattern2 = [80, 40, 50, 70, 40, 70, 40, 80];

    const sitecoreCss = pillarBanner4Prop.params?.Styles ?? '';

    return (
      <div className={`medium-section-container_1440 ${sitecoreCss}`}>
        {/* hero img for mobile */}
        {pillarBanner4Prop.fields.TopSelectedImages && (
          <div className="flex items-center justify-center overflow-hidden">
            <ImageRevealAnimation
              scImage={pillarBanner4Prop.fields.TopSelectedImages[0]?.fields.Image}
              className="aspect-square w-screen object-cover lg:hidden"
              srcSetArr={[{ mw: 540 }]}
              sizes="540px"
            ></ImageRevealAnimation>
          </div>
        )}
        {/* 16 images for desktop */}

        {pillarBanner4Prop.fields.TopSelectedImages && (
          <div className="hidden justify-center gap-[20px] overflow-hidden lg:flex">
            {pillarBanner4Prop.fields.TopSelectedImages.map((image, index) => (
              <FadeInImage
                key={index}
                image={image.fields.Image}
                marginTop={`${marginPattern1[index % marginPattern1.length]}px`}
              />
            ))}
          </div>
        )}
        <div className="mx-[15px] my-[70px] flex flex-col items-center justify-center text-center lg:mx-auto lg:mb-0 lg:mt-[70px] lg:max-w-[700px]">
          <HeaderSection
            heading2={pillarBanner4Prop.fields.Heading}
            // heading2={pillarBanner4Prop.fields.Heading2}
          />
          <BannerTextSectionContent {...pillarBanner4Prop.fields} centerButton={true} />
        </div>
        {/* {pillarBanner4Prop.fields.BottomSelectedImages && (
          <div className="hidden justify-center gap-[20px] overflow-hidden pl-[100px] lg:flex">
            {pillarBanner4Prop.fields.BottomSelectedImages.map((image, index) => (
              <FadeInImage
                key={index}
                image={image.fields.Image}
                marginTop={`${marginPattern2[index % marginPattern2.length]}px`}
              />
            ))}
          </div>
        )}
        {pillarBanner4Prop.fields.BottomSelectedImages && (
          <div className="flex items-center justify-end gap-[25px] overflow-hidden">
            <ImageRevealAnimation
              scImage={pillarBanner4Prop.fields.BottomSelectedImages[0]?.fields.Image}
              className="aspect-[147/210] w-[calc(100vw*(147/375))] lg:hidden"
            ></ImageRevealAnimation>
            <ImageRevealAnimation
              scImage={pillarBanner4Prop.fields.BottomSelectedImages[1]?.fields.Image}
              className="aspect-[187/267] w-[calc(100vw*(187/375))] lg:hidden"
            ></ImageRevealAnimation>
          </div>
        )} */}

        {pillarBanner4Prop.fields.TopSelectedImages && (
          <div className="flex items-center justify-end gap-[25px] overflow-hidden">
            <ImageRevealAnimation
              scImage={pillarBanner4Prop.fields.TopSelectedImages[1]?.fields.Image}
              className="aspect-[147/210] w-[calc(100vw*(147/375))] lg:hidden"
              srcSetArr={[{ mw: 227 }]}
              sizes="227px"
            ></ImageRevealAnimation>
            <ImageRevealAnimation
              scImage={pillarBanner4Prop.fields.TopSelectedImages[2]?.fields.Image}
              className="aspect-[187/267] w-[calc(100vw*(187/375))] lg:hidden"
              srcSetArr={[{ mw: 289 }]}
              sizes="289px"
            ></ImageRevealAnimation>
          </div>
        )}
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};
