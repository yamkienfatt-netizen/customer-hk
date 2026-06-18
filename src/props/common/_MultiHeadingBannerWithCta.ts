import { TextField } from "@sitecore-jss/sitecore-jss-nextjs";
import { _MultiHeadings } from "./_MultiHeadings";
import { _BannerCta } from "./_BannerCta";

export interface _MultiHeadingBannerWithCta extends _MultiHeadings, _BannerCta{
    Description: TextField;
  }
  