import { _FormConsentProps } from '@/props/common/_FormConsentProps';
import { _FormToEmailProps } from '@/props/common/_FormToEmailProps';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import { Treelist } from '../fields/ScField';
import { _Form } from '../common/_Form';
import { _ScItem } from '../common/_ScItem';

export type GeneralFormField = _Form & _FormConsentProps & _FormToEmailProps & {
  TitleConfiguration: _ScItem;
  InquiryConfiguration: _ScItem;
};

export type GeneralFormProps = ComponentProps & {
  rendering: ComponentRendering;
  fields: GeneralFormField;
};
