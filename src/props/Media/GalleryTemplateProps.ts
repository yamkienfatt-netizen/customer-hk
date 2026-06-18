import { _Image } from '@/props/common/_Image';
import { Treelist } from '@/props/fields/ScField';
import { ComponentProps } from 'lib/component-props';
import { _ArticleTagFields } from '../Core/PageProps';
import { TextField, Field } from '@sitecore-jss/sitecore-jss-nextjs';

export interface GalleryImageWithTag extends _Image {
  Tag: {
    fields: _ArticleTagFields;
  };
  Caption: TextField;
}

export interface GalleryTemplateField {
  SelectedImages: Treelist<GalleryImageWithTag>[];
  IsPropertyInnerPage: Field<boolean>;
  IsBrandInnerPage: Field<boolean>;
}

export type GalleryTemplateProps = ComponentProps & {
  fields: GalleryTemplateField;
};
