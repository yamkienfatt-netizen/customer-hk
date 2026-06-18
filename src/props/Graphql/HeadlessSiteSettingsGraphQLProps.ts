import { _SimplePageGraphQLFields } from '../Core/PageProps';

export type HeadlessSiteSettingsGraphQLProps = {
  item : {
    id: string;
    name: string;
    gtmid : {
      value: string;
    }
    cookieConsentContent:{
      jsonValue: {
        value: string;
      };
    }
    cookieConsentVisible: {
      jsonValue: {
        value: boolean;
      };
    }
    cookieConsentButton: {
      jsonValue: {
        value: string;
      };
    }
    cookieConsentExpireDays: {
      jsonValue: {
        value: string;
      };
    }
  }
};
