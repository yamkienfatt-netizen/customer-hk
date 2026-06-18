import { Treelist } from '@/props/fields/ScField';
import { ComponentProps } from 'lib/component-props';
import { _ArticleTagFields, _MultiHeadingSimplePageFields } from '../Core/PageProps';
import { _Image } from '@/props/common/_Image';
import { _ScItem } from '@/props/common/_ScItem';
import { TextField, Field } from '@sitecore-jss/sitecore-jss-nextjs';
import { _ArticleCard } from '@/props/common/_ArticleCard';

export interface ArticleDetailPage extends _ScItem {
  fields: _ArticleCard &
    _Image & {
      ArticleTag: {
        fields: _ArticleTagFields;
      };
    };
}

export interface SelectedArticleField {
  SelectedArticles: Treelist<ArticleDetailPage>[];
  CTAText: TextField;
  IsPropertyInnerPage: Field<boolean>;
  IsBrandInnerPage: Field<boolean>;
}

export type EventListingMultipleProps = ComponentProps & {
  fields: SelectedArticleField;
};
