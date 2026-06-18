import { _FormConsentProps } from "@/props/common/_FormConsentProps";
import { ComponentRendering } from "@sitecore-jss/sitecore-jss-nextjs";
import { ComponentProps } from "lib/component-props";
import { KeyValueConfiguration } from "../Graphql/FormKVConfigurationProps";
import { KeyValueConfigurationProps } from "../DataTemplate/KeyValueConfigurationProps";
import { _ScItem } from "../common/_ScItem";
import { _Form } from "../common/_Form";

export interface SubscriptionFormField extends _Form, _FormConsentProps {
    TitleConfiguration: _ScItem;
    ResidenceLocationConfiguration: _ScItem;
    HotelPropertiesConfiguration: _ScItem;
    CreatedLocation: {
      fields: KeyValueConfigurationProps;
    }
  }

export type SubscriptionFormProps = ComponentProps & {
    rendering: ComponentRendering;
    fields: SubscriptionFormField;
};