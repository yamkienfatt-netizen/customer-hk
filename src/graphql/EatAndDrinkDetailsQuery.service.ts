import { _ArticleCardGraphQL } from '@/props/common/_ArticleCard';
import { _HappeningGraphQL } from '@/props/common/_Happening';
import {
  EatAndDrinkDetailsField,
  EatAndDrinkDetailsQueryProps,
} from '@/props/Graphql/EatAndDrinkDetailsQueryProps';
import clientFactory from 'lib/graphql-client-factory';

//Ref: https://sitecore-nextjs-guide.hakmeng.com/graphql/connected-mode

const EatAndDrinkDetailsQueryDocument = /* GraphQL */ `
  query EatAndDrinkDetailsQuery(
    $startItem: String!
    $language: String!
    $hasLayout: String!
    $afterCursor: String
  ) {
    search(
      where: {
        AND: [
          { name: "_templates", value: "C4E928CF-D40B-46DB-8BEB-7FE1719DE24D", operator: CONTAINS }
          { name: "_path", value: $startItem, operator: CONTAINS }
          { name: "_language", value: $language }
          { name: "_hasLayout", value: $hasLayout }
        ]
      }
      after: $afterCursor
      first: 10
    ) {
      total
      pageInfo {
        endCursor
        hasNext
      }
      results {
        id
        name
        url {
          url
          path
        }
        language {
          name
        }
        ... on _SimplePage {
          title {
            value
            jsonValue
          }
          description {
            value
            jsonValue
          }
          image {
            value
            jsonValue
          }
        }
      }
    }
  }
`;

export const GetEatAndDrinkDetailsService = async (
  startItem: string,
  language: string,
  afterCursor: string
): Promise<Array<EatAndDrinkDetailsField>> => {
  const graphQLClient = clientFactory({});

  const eatAndDrinks = [];

  let result = await graphQLClient.request<EatAndDrinkDetailsQueryProps>(
    EatAndDrinkDetailsQueryDocument as any,
    {
      startItem: startItem,
      language: language,
      hasLayout: 'true',
      afterCursor: afterCursor,
    }
  );

  eatAndDrinks.push(...result.search.results);

  while (result.search.pageInfo.hasNext) {
    result = await graphQLClient.request<EatAndDrinkDetailsQueryProps>(
      EatAndDrinkDetailsQueryDocument as any,
      {
        startItem: startItem,
        language: language,
        hasLayout: 'true',
        afterCursor: result.search.pageInfo.endCursor,
      }
    );
    eatAndDrinks.push(...result.search.results);
  }

  return eatAndDrinks;
};
