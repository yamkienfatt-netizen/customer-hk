import { _ArticleCard } from '@/props/common/_ArticleCard';
import { _ScItem } from '@/props/common/_ScItem';
import { _imageType4 } from '../common/_imageType4';
import { SelectedArticle } from '../PageContent/Article2Prop';
import { ComponentProps } from 'lib/component-props';
import { _MultiHeadings } from '@/props/common/_MultiHeadings';
import { TextField, Field } from '@sitecore-jss/sitecore-jss-nextjs';

export interface MorePastEventsField extends _MultiHeadings {
}

export type MorePastEventsProps = ComponentProps & {
  fields: MorePastEventsField;
};
