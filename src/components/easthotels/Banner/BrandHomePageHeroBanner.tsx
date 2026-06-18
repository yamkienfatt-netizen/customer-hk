import {
  Placeholder as ScPlaceholder,
  Text as ScText,
  useSitecoreContext,
  LayoutServicePageState,
} from '@sitecore-jss/sitecore-jss-nextjs';
import React, { useState, JSX } from 'react';
import { SitecoreLink } from '../CustomTypes/Components/SitecoreLink';
import HeroBanner from 'components/easthotels/Banner/HeroBanner';
import { BrandHomePageHeroBannerProps } from '@/props/Media/BrandHomePageHeroBannersProps';
import { useWindowSize } from '@uidotdev/usehooks';
import Typography from '../Typography/Typography';
import { VideoPlayerDialog } from '../Media/VideoPlayerDialog';
import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import CTAButton from '../Button/CTAButton';
import ComponentError from '../Error/ComponentError';

const HeroBannerText = ({
  brandHomePageHeroBannerProps: brandHomePageHeroBannerProps,
  activeSwiperIndex,
}: {
  brandHomePageHeroBannerProps: BrandHomePageHeroBannerProps;
  activeSwiperIndex: number;
}) => {
  try {
    const { width: windowWidth } = useWindowSize();
    const { sitecoreContext } = useSitecoreContext();
    const isPageEditing = sitecoreContext.pageState === LayoutServicePageState.Edit;
    const { t } = useI18n();
    const previewVidoeUrl =
      brandHomePageHeroBannerProps?.fields?.Banners[activeSwiperIndex]?.fields.PreviewVideo.value
        .href!;
    const vidoeUrl =
      brandHomePageHeroBannerProps?.fields?.Banners[activeSwiperIndex]?.fields.Video.value.href!;

    return (
      //top-[-321px] absolute lg:top-[-55vh]
      <div className="z-10 mx-[15px] flex justify-center text-white md:w-[345px]  lg:mx-[50px] lg:w-[500px]">
        <div>
          <div className="pb-[40px]">
            <Typography
              variant="h1"
              font="Bellefair"
              style={
                windowWidth && windowWidth >= 1280
                  ? {
                      fontSize: 'clamp(50px, 0.75*50px + 1vw, 80px)',
                      lineHeight: 'clamp(50px, 0.75*50px + 1vw, 80px)',
                    }
                  : {}
              }
            >
              <ScText
                field={
                  brandHomePageHeroBannerProps?.fields?.Banners[activeSwiperIndex]?.fields.Title
                }
              />
            </Typography>
          </div>
          <div className="pb-[40px]">
            <Typography variant="p" fontWeight="regular">
              <ScText
                field={
                  brandHomePageHeroBannerProps?.fields?.Banners[activeSwiperIndex]?.fields
                    .Description
                }
              />
            </Typography>
          </div>
          <div className="items-center lg:flex lg:w-[430px]">
            <div className="mr-[20px] hover:cursor-pointer">
              <CTAButton
                text={
                  brandHomePageHeroBannerProps?.fields?.Banners[activeSwiperIndex]?.fields
                    .BannerCTAText
                }
                url={
                  brandHomePageHeroBannerProps?.fields?.Banners[activeSwiperIndex]?.fields
                    .BannerCTAUrl
                }
                variant="underlined"
                fontColor="white"
                extraStyles="font-semibold"
              />
            </div>
            {previewVidoeUrl ? <p className="mr-[20px] hidden lg:block"> | </p> : ''}

            {isPageEditing ? (
              <>
                Video link:{' '}
                <SitecoreLink
                  field={
                    brandHomePageHeroBannerProps?.fields?.Banners[activeSwiperIndex]?.fields.Video
                  }
                />
                Preview Video link:{' '}
                <SitecoreLink
                  field={
                    brandHomePageHeroBannerProps?.fields?.Banners[activeSwiperIndex]?.fields
                      .PreviewVideo
                  }
                />
              </>
            ) : (
              <VideoPlayerDialog url={previewVidoeUrl}>
                {previewVidoeUrl ? (
                  <div className="mt-[20px] hover:cursor-pointer lg:mt-0">
                    <CTAButton
                      disabled
                      text={t(DICTIONARY_CONSTANT.GENERAL.VIDEO_WATCH_BUTTON)}
                      url={previewVidoeUrl}
                      variant="underlined"
                      fontColor="white"
                      extraStyles="font-semibold"
                    />
                  </div>
                ) : (
                  ''
                )}
              </VideoPlayerDialog>
            )}
          </div>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export const Default = (
  brandHomePageHeroBannerProps: BrandHomePageHeroBannerProps
): JSX.Element => {
  try {
    const heroBannerPlaceholderKey = `herobanner-${brandHomePageHeroBannerProps.params?.DynamicPlaceholderId ?? '{*}'}`;
    const sitecoreCss = brandHomePageHeroBannerProps.params?.Styles ?? '';

    const [activeSwiperIndex, setActiveSwiperIndex] = useState(0);

    return (
      <div
        //h-[calc(125svh)] max-[375px]:h-[calc(115svh)] lg:h-[calc(100vh-115px)]
        className={`herobanner-section-container relative ${sitecoreCss} lg:h-[87vh]`}
      >
        <div
          //75px is height of header
          className="relative mt-[75px] h-full w-full"
        >
          <div className="absolute z-10 flex h-full w-full items-center lg:top-[-5vh]">
            <HeroBannerText
              brandHomePageHeroBannerProps={brandHomePageHeroBannerProps}
              activeSwiperIndex={activeSwiperIndex}
            />
          </div>

          <HeroBanner
            banners={brandHomePageHeroBannerProps.fields.Banners}
            onActiveIndexChange={(realIndex) => {
              setActiveSwiperIndex(realIndex);
            }}
          />

          <div className="hidden w-full lg:absolute lg:bottom-0 lg:z-10 lg:block">
            <ScPlaceholder
              name={heroBannerPlaceholderKey}
              rendering={brandHomePageHeroBannerProps.rendering}
            />
          </div>
        </div>

        <div className="w-full lg:absolute lg:bottom-0 lg:z-10 lg:hidden">
          <ScPlaceholder
            name={heroBannerPlaceholderKey}
            rendering={brandHomePageHeroBannerProps.rendering}
          />
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};
