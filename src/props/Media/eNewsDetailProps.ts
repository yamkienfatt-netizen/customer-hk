import { ComponentProps } from 'lib/component-props';
import { _MultiMediaBanner } from '../common/_MultiMediaBanner';

export type eNewsDetailField = _MultiMediaBanner;

export type eNewsDetailProps = ComponentProps & {
  fields: eNewsDetailField;
};
