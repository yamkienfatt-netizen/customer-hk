import { Field, ImageField, LinkField, TextField } from "@sitecore-jss/sitecore-jss-nextjs";
import { _BannerWithCta } from "../common/_BannerWithCta";
import { _imageType4 } from "../common/_imageType4";
import { _quote } from "../common/_quote";
import { Treelist } from "../fields/ScField";
import { _SocialLinks } from "../common/_SocialLinks";

export interface SocialPost extends _quote {
    Image: ImageField;
    Account: TextField;
}

export interface SocialMediaPhotoWallField extends _quote, _SocialLinks {
    Posts: Treelist<SocialPost>[];
    Heading: Field<string>;
}

export type SocialMediaPhotoWallProps = {
  fields: SocialMediaPhotoWallField;
};