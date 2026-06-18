import { FormKeyValueConfigurationsProps } from '@/props/Graphql/FormKVConfigurationProps';
import clientFactory from 'lib/graphql-client-factory';

//Ref: https://sitecore-nextjs-guide.hakmeng.com/graphql/connected-mode

const FormKvQueryDocument = /* GraphQL */ `
  query FormKVQuery($path: String!, $language: String!) {
    # path can be an item tree path or GUID-based id
    item(path: $path, language: $language) {
      id
      name
      children {
        results {
          ... on KeyValueConfiguration {
            key {
              value
            }
            value {
              value
            }
          }
        }
      }
    }
  }
`;

export const GetFormKVConfigurationService = async (
  path: string,
  language: string
): Promise<FormKeyValueConfigurationsProps> => {
  const graphQLClient = clientFactory({});

  const result = await graphQLClient.request<FormKeyValueConfigurationsProps>(
    FormKvQueryDocument as any,
    {
      path: path,
      language: language,
    }
  );

  return result;
};
