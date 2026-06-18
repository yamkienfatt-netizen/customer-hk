import { LinkField } from "@sitecore-jss/sitecore-jss-nextjs";
import { ComponentProps } from "lib/component-props";

export interface VideoCTAField {
    VideoLink: LinkField;
  }
  
  export type VideoCTAProps = ComponentProps & {
    fields: VideoCTAField;
  };
  