import { _FormConsentProps } from '@/props/common/_FormConsentProps';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import { FormKeyValueConfigurationsProps } from '../Graphql/FormKVConfigurationProps';
import { _ScItem } from '../common/_ScItem';
import { _FormToEmailProps } from '../common/_FormToEmailProps';
import { _Form } from '../common/_Form';

export type HotelPickupFormField = _Form & _FormConsentProps & _FormToEmailProps & {
  TitleConfiguration: _ScItem;
};

export type HotelPickupFormProps = ComponentProps & {
  rendering: ComponentRendering;
  fields: HotelPickupFormField;
};
