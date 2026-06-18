import { Field, TextField } from '@sitecore-jss/sitecore-jss-nextjs';

export interface _PageMetadata {
  IsPropertyPage: Field<boolean>;
  IsPropertyInnerPage: Field<boolean>;
  IsBrandInnerPage: Field<boolean>;
}
