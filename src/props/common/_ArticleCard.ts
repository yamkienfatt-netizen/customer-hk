import { ImageField, ImageFieldValue, RichTextField, TextField } from '@sitecore-jss/sitecore-jss-nextjs';
import { _cta } from './_cta';
import { _ArticleTagFields } from '@/props/Core/PageProps';

export interface _ArticleCard extends _cta {
  Legend: TextField;
  Legend2: TextField;
  Title: TextField;
  SubTitle: TextField;
  Description: TextField;
  Content: RichTextField;
  Image: ImageField;
  Date: TextField;
  Time: TextField;
  Location: TextField;
  LongDescription: TextField;
  ArticleTag: {
    fields: _ArticleTagFields;
  };
}

export interface _ArticleCardGraphQL {
  legend: TextField;
  legend2: TextField;
  title: TextField;
  subTitle: TextField;
  description: TextField;
  content: RichTextField;
  image: ImageFieldValue;
  date: TextField;
  time: TextField;
  location: TextField;
  longDescription: TextField;
  articleTag: { jsonValue: {fields: _ArticleTagFields} }
}