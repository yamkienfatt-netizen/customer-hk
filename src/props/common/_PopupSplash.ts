import { Field, ImageField, LinkField, RichTextField, TextField } from "@sitecore-jss/sitecore-jss-nextjs";

export interface _PopupSplash {
    Title: TextField;
    Content: RichTextField;
    CTAText: TextField;
    CTAUrl: LinkField;
    Image: ImageField;
    Visible: Field<boolean>;
  }
  