import { TextField, ImageField, RichTextField } from '@sitecore-jss/sitecore-jss-nextjs';
import { _ArticleTagFields } from './PageProps';

export interface EastStoriesDetailProps {
  Title: TextField;
  Description: TextField;
  Image: ImageField;
  Content: RichTextField;
  ArticleTag: {
    fields: _ArticleTagFields;
  };
}
