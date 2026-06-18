import { ImageField, LinkField, TextField } from "@sitecore-jss/sitecore-jss-nextjs";

export interface _PropertyTeaser{
    fields:{
        Location: TextField;
        Description: TextField;
        Image: ImageField;
        Link: LinkField;
    }
}