import { HeadlessSiteSettingsGraphQLProps } from '@/props/Graphql/HeadlessSiteSettingsGraphQLProps';
import clientFactory from 'lib/graphql-client-factory';

const HeadlessSiteSettingsQueryDocument = /* GraphQL */ `
  query HeadlessSiteSettingsQuery($contextItem: String!, $language: String!) {
    item(path: $contextItem, language: $language) {
      id
      name
      gtmid: field(name: "GTMID") {
        ... on TextField {
          value
        }
      }
      cookieConsentContent: field(name: "CookieConsentContent") {
        ... on RichTextField {
          jsonValue
        }
      }
      cookieConsentVisible: field(name: "CookieConsentVisible") {
        ... on CheckboxField {
          value
          jsonValue
        }
      }
      cookieConsentButton: field(name: "CookieConsentButton") {
        ... on TextField {
          value
          jsonValue
        }
      }
      cookieConsentExpireDays: field(name: "CookieConsentExpireDays") {
        ... on NumberField {
          value
          jsonValue
        }
      }
    }
  }
`;

export const GetHeadlessSiteSettingsService = async (
  contextItem: string,
  language: string
): Promise<HeadlessSiteSettingsGraphQLProps> => {
  const graphQLClient = clientFactory({});

  const result = await graphQLClient.request<HeadlessSiteSettingsGraphQLProps>(
    HeadlessSiteSettingsQueryDocument as any,
    {
      contextItem: contextItem,
      language: language,
    }
  );

  return result;
};
