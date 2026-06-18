import { Field, LinkField } from '@sitecore-jss/sitecore-jss-nextjs';

export interface _SeoMetadata {
  PageTitle?: Field;
  MetaDescription?: Field;
  MetaKeywords?: Field;
  CanonicalUrl?: LinkField;
}
