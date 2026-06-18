import { TextField } from '@sitecore-jss/sitecore-jss-nextjs';
import { Treelist } from '../fields/ScField';
import { _SimpleText } from './_SimpleText';

export interface _CarouselBanner<T> {
  Title: TextField;
  SelectedArticles: Treelist<T>[];
}
