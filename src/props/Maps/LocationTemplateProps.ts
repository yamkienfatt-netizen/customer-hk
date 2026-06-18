import { TextField } from "@sitecore-jss/sitecore-jss-nextjs";
import { ComponentProps } from "lib/component-props";

export type LocationTemplateField = {
    GoogleMapEmbededURL: TextField;
    GaodeKey: TextField;
    GaodeLatitude: TextField;
    GaodeLongitude: TextField;    
}

export type LocationTemplateProps = ComponentProps & {
    fields: LocationTemplateField;
  };