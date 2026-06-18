import { _MultiMediaBanner } from '@/props/common/_MultiMediaBanner';
import { FullWidthBannerProps } from '@/props/Media/FullWidthBannerProps';
import {
  Image as ScImage,
  useSitecoreContext,
  LayoutServicePageState,
  withDatasourceCheck,
} from '@sitecore-jss/sitecore-jss-nextjs';
import ComponentError from '../Error/ComponentError';

const FullWidthBanner = (fullWidthBannerProps: FullWidthBannerProps) => {
  try {
    const isImage = fullWidthBannerProps.fields.Image?.value?.src != undefined;

    return isImage ? (
      <div>
        <ScImage
          field={fullWidthBannerProps.fields.Image}
          className="aspect-[4/3] max-h-[60vh] w-full object-cover lg:h-[60vh]"
        />
      </div>
    ) : (
      <video autoPlay loop muted className="w-full">
        <source src={fullWidthBannerProps.fields.Video.value.href} type="video/mp4" />
      </video>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};
export default withDatasourceCheck()<FullWidthBannerProps>(FullWidthBanner);
