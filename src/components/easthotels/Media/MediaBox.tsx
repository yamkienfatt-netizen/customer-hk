import React from 'react';
import ImageRevealAnimation from '../Animation/ImageRevealAnimation';
import { MediaBoxProps } from '@/props/media/MediaBoxProps';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import ComponentError from '../Error/ComponentError';

const Default = (mediaBoxProps: MediaBoxProps) => {
  try {
    const height = mediaBoxProps?.fields?.Image?.value?.height || 516;
    const width = mediaBoxProps?.fields?.Image?.value?.width || 540;

    return (
      <div className="mx-auto mt-[50px] flex w-full max-w-[540px] md:max-w-[540px] lg:justify-center">
        <div className="mx-[15px]">
          <ImageRevealAnimation
            scImage={mediaBoxProps.fields.Image}
            scVideo={mediaBoxProps.fields.VideoLink}
            dummyVideo={mediaBoxProps.fields.VideoLink?.value.href}
            // height={~~height}
            // width={~~width}
            className="aspect-square w-full object-cover lg:max-w-[540px]"
          />
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default withDatasourceCheck()<MediaBoxProps>(Default);
