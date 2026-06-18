import { _SimpleText } from '@/props/common/_SimpleText';
import { TextField, ImageField, RichTextField } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';

export type TwoColumnImageField = {
  LeftTitle: TextField;
  LeftDescription: TextField;
  LeftImage: ImageField;
  LeftContent: RichTextField;

  RightTitle: TextField;
  RightDescription: TextField;
  RightImage: ImageField;
  RightContent: RichTextField;
};

export type TwoColumnImageProps = ComponentProps & {
  fields: TwoColumnImageField;
};
