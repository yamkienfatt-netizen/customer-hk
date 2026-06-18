import { _Image } from "./_Image";
import { ComponentRendering, ComponentParams, ImageField, LinkField, RichTextField, TextField } from '@sitecore-jss/sitecore-jss-nextjs';

export interface _MultiMediaBanner{
    Image: ImageField;
    Video: LinkField;
    PreviewVideo: LinkField;
    Title: TextField;
    Description: TextField;
    Content: RichTextField;
    BannerCTAText: TextField;
    BannerCTAUrl: LinkField;
}