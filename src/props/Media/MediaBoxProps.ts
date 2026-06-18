import { _Video } from '../common/_Video';
import { _Image } from '../common/_Image';
import { ComponentProps } from 'lib/component-props';

export interface MediaBoxField extends _Video, _Image {}

export type MediaBoxProps = ComponentProps & {
  fields: MediaBoxField;
};
