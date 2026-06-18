import { _cta } from '../common/_cta';
import { _BannerWithCta } from '../common/_BannerWithCta';
import { _item } from '../common/_item';
import { _quote } from '../common/_quote';
import { _PositionalImages } from '../common/_PositionalImages';
import { ComponentProps } from 'lib/component-props';

export interface PillarBannerField extends _BannerWithCta, _quote, _PositionalImages {}

export interface PillarBanner4Field extends _BannerWithCta, _quote {
  TopSelectedImages: _item[];
  BottomSelectedImages: _item[];
}

export type PillarBannerProps = ComponentProps & {
  fields: PillarBannerField;
};

export type PillarBanner4Props = {
  fields: PillarBanner4Field;
}