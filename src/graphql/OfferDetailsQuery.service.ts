import { _ArticleCardGraphQL } from '@/props/common/_ArticleCard';
import { _HappeningGraphQL } from '@/props/common/_Happening';
import { OfferDetailsField, OfferDetailsQueryProps } from '@/props/Graphql/OfferDetailsQueryProps';
import clientFactory from 'lib/graphql-client-factory';

//Ref: https://sitecore-nextjs-guide.hakmeng.com/graphql/connected-mode

const OfferDetailsQueryDocument = /* GraphQL */ `
  query OfferDetailsQuery(
    $startItem: String!
    $excludedItem: String!
    $language: String!
    $hasLayout: String!
    $afterCursor: String
  ) {
    search(
      where: {
        AND: [
          { name: "_templates", value: "3D4245AB-6933-4B9A-AB35-73F3237920AD", operator: CONTAINS }
          { name: "_path", value: $startItem, operator: CONTAINS }
          { name: "_language", value: $language }
          { name: "_hasLayout", value: $hasLayout }
          { name: "_path", operator: NCONTAINS, value: $excludedItem }
        ]
      }
      after: $afterCursor
      first: 5
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
        ... on OfferDetailPage {
          articleTag {
            value
            jsonValue
          }
          legend {
            value
            jsonValue
          }
          legend2 {
            value
            jsonValue
          }
          image: field(name: "Image") {
            ... on ImageField {
              value
              jsonValue
            }
          }
          title {
            value
            jsonValue
          }
          subTitle {
            value
            jsonValue
          }
          description {
            value
            jsonValue
          }
        }
      }
    }
  }
`;

export const GetOfferDetailsService = async (
  startItem: string,
  language: string,
  excludeCurrentItem: string,
  afterCursor: string
): Promise<Array<OfferDetailsField>> => {
  const graphQLClient = clientFactory({});

  const offers = [];

  let result = await graphQLClient.request<OfferDetailsQueryProps>(
    OfferDetailsQueryDocument as any,
    {
      startItem: startItem,
      excludedItem: excludeCurrentItem,
      language: language,
      hasLayout: 'true',
      afterCursor: afterCursor,
    }
  );

  offers.push(...result.search.results);

  return offers;
};
