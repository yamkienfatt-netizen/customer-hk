import { _MultiHeadings } from "@/props/common/_MultiHeadings";
import { ComponentProps } from "lib/component-props";
import { Treelist } from "@/props/fields/ScField";
import { Field, TextField } from "@sitecore-jss/sitecore-jss-nextjs";
import { _ArticleCard } from "@/props/common/_ArticleCard";

export interface OffersField {
    Title: TextField;
    SelectedArticles: Treelist<_ArticleCard>[];
    WithImage: Field<boolean>;
    CTAText: TextField;
  }
  
  export type OffersProps = ComponentProps & {
    fields: OffersField;
  };


  