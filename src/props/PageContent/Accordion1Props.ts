import { _ArticleCard } from "@/props/common/_ArticleCard";
import { _MultiHeadingBannerWithCta } from "@/props/common/_MultiHeadingBannerWithCta";
import { _ScItem } from "@/props/common/_ScItem";
import { _SimpleText } from "@/props/common/_SimpleText";
import { Treelist } from "@/props/fields/ScField";
import { Field } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';

export type Accordion1Field = {
  AccordionList: Treelist<_SimpleText>[];
  withStickyMobileMenu: Field<boolean>;
};
  
  export type Accordion1Props = ComponentProps & {
    fields: Accordion1Field;
  };
  

  export type AccordionItemField = _SimpleText & {
  };


  export type AccordionItemProps = ComponentProps & {
    fields: AccordionItemField;
  };