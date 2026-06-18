import { _SimpleText } from "@/props/common/_SimpleText";
import { _quote } from "@/props/common/_quote";
import { Treelist } from "@/props/fields/ScField";
import { ComponentProps } from "lib/component-props";

export type TestimonialField = {
  SelectedArticles: Treelist<_quote>[];
}


export type TestimonialProps = ComponentProps & {
    fields: TestimonialField;
  };
  