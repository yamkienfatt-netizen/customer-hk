import { _ArticleCard } from "@/props/common/_ArticleCard";
import { _ScItem } from "@/props/common/_ScItem";
import { ComponentProps } from "lib/component-props";

export type SelectedArticle = _ScItem & {
    fields: _ArticleCard;
}

export type Article2Prop = ComponentProps & {
    fields: {
        SelectedArticles: SelectedArticle[];
    };
};