import { LinkField, Field, TextField, RichTextField, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';
import { _Image } from './_Image';

export interface _BannerWithCta extends _Image{
  Heading?: TextField;
  Subheading: TextField;
  Description: TextField;
  Content: RichTextField;
  BannerCTAUrl: LinkField;
  BannerCTAText: TextField;
}
