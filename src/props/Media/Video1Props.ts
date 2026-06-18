import { ComponentProps } from 'lib/component-props';
import { _Video } from '../common/_Video';
import { TextField } from '@sitecore-jss/sitecore-jss-nextjs';

export interface Video1Field extends _Video {
  Height: TextField;
}

export type Video1Props = ComponentProps & {
  fields: Video1Field;
};
