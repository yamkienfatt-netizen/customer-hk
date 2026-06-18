import { Field, ImageField, RichTextField, TextField } from '@sitecore-jss/sitecore-jss-nextjs';
import { _MultiHeadings } from './_MultiHeadings';

export interface _MultiHeadingBanner extends _MultiHeadings {
  Logo: ImageField;
}
