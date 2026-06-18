import React from 'react';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import Typography from 'components/easthotels/Typography/Typography';
import { VideoPlayerDialog } from 'components/easthotels/Media/VideoPlayerDialog';
import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import ComponentError from '../Error/ComponentError';
import { VideoCTAProps } from '@/props/media/VideoCTAProps';
import {
  LayoutServicePageState,
  LinkField,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { SitecoreLink } from '../CustomTypes/Components/SitecoreLink';
import Image from 'next/image';

const publicUrl = getPublicUrl();

const VideoCTA = (videoCTAProps: VideoCTAProps) => {
  try {
    const { t } = useI18n();
    const { sitecoreContext } = useSitecoreContext();
    const isPageEditing = sitecoreContext.pageState === LayoutServicePageState.Edit;

    const sitecoreCss = videoCTAProps.params?.Styles ?? '';
    return (
      <>
        {isPageEditing && (
          <>
            Video Link: <SitecoreLink field={videoCTAProps.fields.VideoLink}></SitecoreLink>
          </>
        )}
        <div
          className={
            'small-section-container_70-margin !max-w-[500px] lg:flex lg:justify-center ' +
            sitecoreCss +
            (sitecoreCss.includes('no-space') ? ' !my-0' : '')
          }
        >
          <VideoPlayerDialog url={videoCTAProps.fields.VideoLink.value.href!}>
            <div className="mx-[15px] inline-flex flex-row border-b-2 border-black-secondary hover:cursor-pointer lg:mx-auto ">
              <Image
                src={`${publicUrl}/icon_arrow_down_black.svg`}
                alt=""
                className="mr-[3px] mt-[-3px] rotate-[270deg]"
                width={10}
                height={21}
              />
              <Typography variant="l1" fontWeight="bold">
                {t(DICTIONARY_CONSTANT.GENERAL.VIDEO_WATCH_BUTTON)}
              </Typography>
            </div>
          </VideoPlayerDialog>
        </div>
      </>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default VideoCTA;
