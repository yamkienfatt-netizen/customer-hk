import { TextField, RichTextField } from "@sitecore-jss/sitecore-jss-nextjs";

export interface _Form{
    Title: TextField;
    Description: TextField;
    Content: RichTextField;

    SuccessMessage: RichTextField;
    ErrorMessage: RichTextField;
}