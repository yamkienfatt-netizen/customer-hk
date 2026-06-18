import { _MultiMediaBanner } from '@/props/common/_MultiMediaBanner';
import { _MultiHeadingBanner } from '@/props/common/_MultiHeadingBanner';
import { _PositionalImages } from '@/props/common/_PositionalImages';
import { Field, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';

export type FullWidthBannerProps = ComponentProps & {
    fields: _MultiMediaBanner;
};
