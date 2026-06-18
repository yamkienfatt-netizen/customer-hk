import { _MultiHeadingBanner } from '@/props/common/_MultiHeadingBanner';
import { _cta } from '@/props/common/_cta';
import { _imageType4 } from '@/props/common/_imageType4';
import { _BannerWithCta } from '../common/_BannerWithCta';
import { _MultiHeadingBannerWithCta } from '../common/_MultiHeadingBannerWithCta';
import { _MultiImages } from '../common/_MultiImages';
import { ComponentProps } from 'lib/component-props';
import { _Image } from '@/props/common/_Image';
import { _PositionalImages } from '@/props/common/_PositionalImages';
import { Field, ImageField, TextField } from '@sitecore-jss/sitecore-jss-nextjs';
import { _SimpleText } from '@/props/common/_SimpleText';
import { _MultiHeadings } from '../common/_MultiHeadings';
import { _BannerCta } from '../common/_BannerCta';

export interface ImageBanner1Field extends _MultiHeadingBannerWithCta, _MultiImages {}

export interface ImageBanner2Field extends _MultiHeadingBanner, _cta, _imageType4 {
  ImageForMobile: ImageField;
}

export interface ImageBanner3Field extends _BannerWithCta, _PositionalImages {
  IsMobileRevertedLayout: Field<boolean>;
}

export interface ImageBanner4Field extends _Image, _imageType4, _BannerWithCta {}

export interface ImageBanner5Field extends _BannerWithCta, _Image {}

export interface ImageBanner6Field extends _BannerWithCta, _Image {
  ImageOnRight: boolean;
  NoMargin: boolean;
  BigCTA: boolean;
  BigHeader: TextField;
  MobileAlignCenter: boolean;
}

export interface ImageBanner8Field extends _MultiHeadingBannerWithCta, _SimpleText {
  ImageOnRight: boolean;
  NoMargin: boolean;
  BigCTA: boolean;
}

export interface ImageBanner9Field extends _BannerWithCta, _PositionalImages {}

export interface ImageBanner10Field extends _MultiHeadingBannerWithCta, _MultiImages {}

export interface ImageBanner11Field extends _BannerWithCta, _PositionalImages {}

export interface ImageBanner13Field extends _MultiHeadings, _BannerCta {}

export type ImageBanner1Props = {
  fields: ImageBanner1Field;
};

export type ImageBanner2Props = {
  fields: ImageBanner2Field;
};

export type ImageBanner3Props = ComponentProps & {
  fields: ImageBanner3Field;
};

export type ImageBanner4Props = ComponentProps & {
  fields: ImageBanner4Field;
};

export type ImageBanner5Props = {
  fields: ImageBanner5Field;
};

export type ImageBanner6Props = ComponentProps & {
  fields: ImageBanner6Field;
};

export type ImageBanner7Props = ComponentProps & {
  fields: _BannerWithCta & {
    ImageOnRight: Field<boolean>;
  };
};

export type ImageBanner8Props = ComponentProps & {
  fields: ImageBanner8Field;
};

export type ImageBanner9Props = ComponentProps & {
  fields: ImageBanner9Field;
};

export type ImageBanner10Props = {
  fields: ImageBanner10Field;
};

export type ImageBanner11Props = ComponentProps & {
  fields: ImageBanner11Field;
};

export type ImageBanner12Props = ComponentProps & {
  fields: _BannerWithCta & {
    SmallHeading: {
      value: string;
    };
  };
};

export type ImageBanner13Props = ComponentProps & {
  fields: ImageBanner13Field & {
    Image1: ImageField;
    Image2: ImageField;
  };
};
