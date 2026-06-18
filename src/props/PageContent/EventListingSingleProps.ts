import { _ArticleCard } from "@/props/common/_ArticleCard";
import { _cta } from "@/props/common/_cta";
import { ComponentProps } from "lib/component-props";


export type EventListingSingleProps = ComponentProps & {
    fields: _ArticleCard & _cta;
};