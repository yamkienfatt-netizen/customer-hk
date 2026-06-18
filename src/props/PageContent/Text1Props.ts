import { RichTextField } from "@sitecore-jss/sitecore-jss-nextjs";
import { ComponentProps } from "lib/component-props";

export interface Text1Fields{
    Content: RichTextField;
}

export type Text1Props = ComponentProps & {
    fields: Text1Fields;
};