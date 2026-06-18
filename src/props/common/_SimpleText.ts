import { ImageField, RichTextField, TextField } from "@sitecore-jss/sitecore-jss-nextjs";
import { _ScItem } from "./_ScItem";


export interface _SimpleText {
    Title: TextField;
    Description: TextField;
    Image: ImageField;
    Content: RichTextField;
  }
  