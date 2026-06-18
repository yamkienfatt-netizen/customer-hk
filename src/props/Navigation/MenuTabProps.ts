import { _DocumentLink } from "@/props/common/_DocumentLink";
import { Treelist } from "@/props/fields/ScField";
import { TextField } from "@sitecore-jss/sitecore-jss-nextjs";
import { ComponentProps } from "lib/component-props";


export type MenuTabProps = ComponentProps & {
    fields: {
        SelectedArticles: Treelist<_DocumentLink>[];
        Title: TextField;
        CTAText: TextField;
    };
};