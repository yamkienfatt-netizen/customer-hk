import { _FormConsentProps } from '@/props/common/_FormConsentProps';
import { _FormToEmailProps } from '@/props/common/_FormToEmailProps';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import { Treelist } from '../fields/ScField';
import { _Form } from '../common/_Form';
import { _ScItem } from '../common/_ScItem';

export type MediaFormField = _Form & _FormConsentProps & _FormToEmailProps & {
  TitleConfiguration: _ScItem;
};

export type MediaFormProps = ComponentProps & {
  rendering: ComponentRendering;
  fields: MediaFormField;
};
