import { _cta } from '../common/_cta';
import { _BannerWithCta } from '../common/_BannerWithCta';
import { _item } from '../common/_item';
import { _quote } from '../common/_quote';
import { _PositionalImages } from '../common/_PositionalImages';
import { _Image } from '../common/_Image';
import { Treelist } from '../fields/ScField';
import { Component } from '@sitecore-feaas/clientside';
import { ComponentProps } from 'lib/component-props';
import { TextField, Field } from '@sitecore-jss/sitecore-jss-nextjs';

export interface Gallery1Field {
  Images: Treelist<_Image>[];
  IsPropertyInnerPage: Field<boolean>;
  IsBrandInnerPage: Field<boolean>;
}

export type Gallery1Props = ComponentProps & {
  fields: Gallery1Field;
};
