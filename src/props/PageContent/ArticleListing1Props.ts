import { Treelist } from "@/props/fields/ScField";
import { ComponentProps } from "lib/component-props";
import { _ArticleTagFields, _MultiHeadingSimplePageFields } from "../Core/PageProps";
import { _Image } from "@/props/common/_Image";
import { _ScItem } from "@/props/common/_ScItem";
import { TextField } from "@sitecore-jss/sitecore-jss-nextjs";
import { _ArticleCard } from "@/props/common/_ArticleCard";

//_MultiHeadingSimplePageFields

export interface Article1DetailPage extends _ScItem {
    fields: _ArticleCard & {
        ArticleTag: {
            fields: _ArticleTagFields;
        }
    }
}

export interface SelectedArticle1Field {
    SelectedArticles: Treelist<Article1DetailPage>[];
    ArticleCTALabel: TextField;
}
  

export type Article1ListingProps = ComponentProps & {
    fields: SelectedArticle1Field;
};