import { BreadcrumbGraphQLProps } from '@/props/Graphql/BreadcrumbGraphQLProps';
import clientFactory from 'lib/graphql-client-factory';

export const BREADCRUMB_QUERY = /* GraphQL */ `
  query BreadcrumbQuery($contextItem: String!, $language: String!) {
    item(path: $contextItem, language: $language) {
      id
      name
      ... on _SimplePage {
        title {
          value
          jsonValue
        }
      }
      ... on _ArticleCard {
        title {
          value
          jsonValue
        }
      }
      url {
        url
        path
      }
      ancestors(hasLayout: true) {
        id
        name
        url {
          url
          path
        }
        template {
          id
          name
        }
        ... on _SimplePage {
          title {
            value
            jsonValue
          }
        }
        ... on _ArticleCard {
          title {
            value
            jsonValue
          }
        }
      }
    }
  }
`;

export const GetBreadcrumbService = async (
  path: string,
  language: string
): Promise<BreadcrumbGraphQLProps> => {
  const graphQLClient = clientFactory({});

  const result = await graphQLClient.request<BreadcrumbGraphQLProps>(BREADCRUMB_QUERY, {
    path: path,
    language: language,
  });

  return result;
};
