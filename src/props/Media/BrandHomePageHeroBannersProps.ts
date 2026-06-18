import { _MultiMediaBanner } from '@/props/common/_MultiMediaBanner';
import { _cta } from '@/props/common/_cta';
import { _BannerWithCta } from '@/props/common/_BannerWithCta';
import { ComponentRendering, ComponentParams } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import { Treelist } from '@/props/fields/ScField';

export interface BrandHomePageHeroBannerField {
  Banners: Treelist<_MultiMediaBanner>[];
}

export type BrandHomePageHeroBannerProps = ComponentProps & {
  fields: BrandHomePageHeroBannerField;
  activeSwiperIndex: number;
};
