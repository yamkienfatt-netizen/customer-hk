import { _MultiHeadingBanner } from '@/props/common/_MultiHeadingBanner';
import { _MultiHeadingBannerWithCta } from '@/props/common/_MultiHeadingBannerWithCta';
import { ComponentProps } from 'lib/component-props';
import { _cta } from '@/props/common/_cta';

export type Title2Prop = ComponentProps & {
  fields: _MultiHeadingBannerWithCta &
    _cta & {
      MobileCenter: { value: boolean };
    };
};
