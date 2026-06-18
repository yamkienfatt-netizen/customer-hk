import { _ArticleCard } from '@/props/common/_ArticleCard';
import { _ScItem } from '@/props/common/_ScItem';
import { _cta } from '@/props/common/_cta';
import { _cta2 } from '@/props/common/_cta2';
import { Treelist } from '@/props/fields/ScField';
import { TextField, Field, LinkField } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';

export interface CompareListingSwiperField {
  Title: TextField;
  ContentTemplate: _ScItem;
  ComparisonPage: LinkField;
}

export type CompareListingSwiperProps = ComponentProps & {
  fields: CompareListingSwiperField;
};
