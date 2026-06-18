import React, { JSX } from 'react';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import Typography from 'components/easthotels/Typography/Typography';
import { VideoPlayerDialog } from 'components/easthotels/Media/VideoPlayerDialog';
import FadeInUp from 'components/easthotels/Animation/FadeInUp';
import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import {
  withDatasourceCheck,
  Image as ScImage,
  useSitecoreContext,
  LayoutServicePageState,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { SitecoreLink } from '../CustomTypes/Components/SitecoreLink';
import { Video1Props } from '@/props/media/Video1Props';
import { SiteConfigurationProp } from '@/props/SiteConfigurationProp';
import ComponentError from '../Error/ComponentError';
import Image from 'next/image';

const publicUrl = getPublicUrl();

// interface Video1Prop {
//   image: string;
//   video: string;
//   className?: string;
// }

// Todo: Need to check how to pass the class name from sitecore instead of programmatically hardcoded
//{ image, video, className }

const Default = (video1Props: Video1Props): JSX.Element => {
  try {
    const { sitecoreContext } = useSitecoreContext();
    const isPageEditing = sitecoreContext.pageState === LayoutServicePageState.Edit;
    const customHeight = video1Props.fields.Height.value;

    const isVideo = video1Props.fields.VideoLink.value.href!;
    const { t } = useI18n();
    const className = '';
    const sitecoreCss = video1Props.params?.Styles ?? '';

    return (
      <FadeInUp>
        <div
          className={`small-section-container relative flex justify-center lg:px-[50px] ${sitecoreCss} ${className}`}
        >
          {/* Show page editing style */}
          {isPageEditing ? (
            <>
              Video link: <SitecoreLink field={video1Props.fields.VideoLink} />
              <ScImage
                field={video1Props.fields.VideoPreview}
                className="h-full w-full object-cover"
              />
            </>
          ) : (
            <></>
          )}

          {/* Direct show the component if not page editing */}
          {!isPageEditing ? (
            isVideo ? (
              <video
                autoPlay
                loop
                muted
                poster={video1Props.fields.VideoPreview.value?.src!}
                className={'w-full object-cover'}
                style={{ height: customHeight ? ~~customHeight : '100%' }}
              >
                <source src={video1Props.fields.VideoLink.value.href!} type="video/mp4" />
              </video>
            ) : (
              <ScImage
                field={video1Props.fields.VideoPreview}
                className="h-full w-full object-cover"
              />
            )
          ) : (
            <></>
          )}

          <VideoPlayerDialog url={video1Props.fields.VideoLink.value.href!}>
            <div className="absolute bottom-[27px] z-10 flex flex-row border-b-2 border-white hover:cursor-pointer lg:bottom-[50px]">
              <Typography variant="l1" fontWeight="bold" fontColor="white">
                {t(DICTIONARY_CONSTANT.GENERAL.VIDEO_WATCH_BUTTON)}
              </Typography>
              <Image
                src={`${publicUrl}/icon_header_arrow_white.svg`}
                alt=""
                className="ml-[7px] mt-[-3px] rotate-[270deg]"
                width={8}
                height={5}
              />
            </div>
          </VideoPlayerDialog>
        </div>
      </FadeInUp>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default withDatasourceCheck()<Video1Props>(Default);
