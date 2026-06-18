import { _ArticleCard } from '@/props/common/_ArticleCard';
import { _ScItem } from '@/props/common/_ScItem';
import { _cta } from '@/props/common/_cta';
import { _cta2 } from '@/props/common/_cta2';
import { Treelist } from '@/props/fields/ScField';
import { TextField, Field } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';

export interface SpeakerBioDetailProps extends _ScItem {
  fields: _ArticleCard & _cta & _cta2;
}

export interface SelectedArticleField {
  SelectedArticles: Treelist<SpeakerBioDetailProps>[];
  Heading1: TextField;
  Heading2: TextField;
  IsPropertyInnerPage: Field<boolean>;
  ButtonLightbox: Field<boolean>;
}

export type SpeakerBiosProps = ComponentProps & {
  fields: SelectedArticleField;
};
