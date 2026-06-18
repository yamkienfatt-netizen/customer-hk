import { Field, withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import CookieBanner from './CookieBanner';
import { ComponentProps } from 'lib/component-props';

type CookieBannerWrapperProps = ComponentProps & {
  fields: {
    CookieConsentContent: Field<string>;
    CookieConsentVisible: Field<boolean>;
    CookieConsentButton: Field<string>;
    CookieConsentExpireDays: Field<number>;
  };
};

const Default = (props: CookieBannerWrapperProps) => {
  return (
    <CookieBanner
      cookieConsentButton={props.fields?.CookieConsentButton?.value}
      cookieConsentContent={props.fields?.CookieConsentContent?.value}
      cookieConsentVisible={true}
      cookieConsentExpireDays={props.fields?.CookieConsentExpireDays?.value}
    />
  );
};

export default withDatasourceCheck()<CookieBannerWrapperProps>(Default);
