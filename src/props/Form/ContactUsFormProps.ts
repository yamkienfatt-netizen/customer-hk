import { _FormConsentProps } from '@/props/common/_FormConsentProps';
import { _FormToEmailProps } from '@/props/common/_FormToEmailProps';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import { Treelist } from '../fields/ScField';
import { _Form } from '../common/_Form';

export type ContactUsFormField = _FormConsentProps & _FormToEmailProps & {
  SelectedForms: Treelist<_Form>[];
};

export type ContactUsFormProps = ComponentProps & {
  rendering: ComponentRendering;
  fields: ContactUsFormField;
};
