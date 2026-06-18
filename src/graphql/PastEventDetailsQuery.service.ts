import { _ArticleCardGraphQL } from '@/props/common/_ArticleCard';
import { _HappeningGraphQL } from '@/props/common/_Happening';
import {
  PastEventDetailsField,
  PastEventDetailsQueryProps,
} from '@/props/Graphql/PastEventDetailsQueryProps';
import { EastIDs } from '@/utilities/EastIdsConstant';
import clientFactory from 'lib/graphql-client-factory';

//Ref: https://sitecore-nextjs-guide.hakmeng.com/graphql/connected-mode

const PastEventDetailsQueryDocument = /* GraphQL */ `
  query PastEventDetailsQuery(
    $startItem: String!
    $excludedItem: String!
    $templateId: String!
    $language: String!
    $hasLayout: String!
    $todayDate: String!
    $afterCursor: String
  ) {
    search(
      where: {
        AND: [
          { name: "_templates", value: $templateId, operator: CONTAINS }
          { name: "_path", value: $startItem, operator: CONTAINS }
          { name: "_language", value: $language }
          { name: "_hasLayout", value: $hasLayout }
          { name: "eventDate", operator: LT, value: $todayDate }
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
        ... on ITWUTEventDetailsPage {
          eventDate {
            value
            jsonValue
          }
          articleTag {
            value
            jsonValue
          }
          legend {
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
          description {
            value
            jsonValue
          }
        }
      }
    }
  }
`;

const PastEventZhDetailsQueryDocument = /* GraphQL */ `
  query PastEventZhDetailsQuery(
    $startItem: String!
    $excludedItem: String!
    $excludeMIItemPath: String!
    $templateId: String!
    $language: String!
    $hasLayout: String!
    $todayDate: String!
    $afterCursor: String
  ) {
    search(
      where: {
        AND: [
          { name: "_templates", value: $templateId, operator: CONTAINS }
          { name: "_path", value: $startItem, operator: CONTAINS }
          { name: "_language", value: $language }
          { name: "_hasLayout", value: $hasLayout }
          { name: "eventDate", operator: LT, value: $todayDate }
          { name: "_path", value: $excludeMIItemPath, operator: NCONTAINS }
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
        ... on ITWUTEventDetailsPage {
          eventDate {
            value
            jsonValue
          }
          articleTag {
            value
            jsonValue
          }
          legend {
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
          description {
            value
            jsonValue
          }
        }
      }
    }
  }
`;

const PastEventEsPtDetailsQueryDocument = /* GraphQL */ `
  query PastEventEsPtDetailsQuery(
    $startItem: String!
    $excludedItem: String!
    $excludeHKItemPath: String!
    $excludeBJItemPath: String!
    $templateId: String!
    $language: String!
    $hasLayout: String!
    $todayDate: String!
    $afterCursor: String
  ) {
    search(
      where: {
        AND: [
          { name: "_templates", value: $templateId, operator: CONTAINS }
          { name: "_path", value: $startItem, operator: CONTAINS }
          { name: "_language", value: $language }
          { name: "_hasLayout", value: $hasLayout }
          { name: "eventDate", operator: LT, value: $todayDate }
          { name: "_path", value: $excludeHKItemPath, operator: NCONTAINS }
          { name: "_path", value: $excludeBJItemPath, operator: NCONTAINS }
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
        ... on ITWUTEventDetailsPage {
          eventDate {
            value
            jsonValue
          }
          articleTag {
            value
            jsonValue
          }
          legend {
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
          description {
            value
            jsonValue
          }
        }
      }
    }
  }
`;

export const GetPastEventDetailsService = async (
  startItem: string,
  language: string,
  excludeCurrentItem: string,
  afterCursor: string
): Promise<Array<PastEventDetailsField>> => {
  const graphQLClient = clientFactory({});

  const date = new Date();

  let day: number | string = date.getDate();
  let month: number | string = date.getMonth() + 1;
  let year: number = date.getFullYear();

  if (day < 10) day = '0' + day;
  if (month < 10) month = '0' + month;

  const pastEventDetails = [];

  let result = null;

  console.log(`pasteventdetailquery ${language}`);

  if (language == 'es' || language == 'pt') {
    result = await graphQLClient.request<PastEventDetailsQueryProps>(
      PastEventEsPtDetailsQueryDocument as any,
      {
        startItem: startItem,
        excludedItem: excludeCurrentItem,
        templateId: EastIDs.PAST_EVENT_DETAIL_TEMPLATE,
        language: language,
        todayDate: `${year}${month}${day}T000000Z`,
        hasLayout: 'true',
        afterCursor: afterCursor,
        excludeHKItemPath: EastIDs.EASTHONGKONG_ROOT_ITEM,
        excludeBJItemPath: EastIDs.EASTBEIJING_ROOT_ITEM,
      }
    );
  } else if (language.startsWith('zh')) {
    result = await graphQLClient.request<PastEventDetailsQueryProps>(
      PastEventZhDetailsQueryDocument as any,
      {
        startItem: startItem,
        excludedItem: excludeCurrentItem,
        templateId: EastIDs.PAST_EVENT_DETAIL_TEMPLATE,
        language: language,
        todayDate: `${year}${month}${day}T000000Z`,
        hasLayout: 'true',
        afterCursor: afterCursor,
        excludeMIItemPath: EastIDs.EASTMIAMI_ROOT_ITEM,
      }
    );
  } else {
    result = await graphQLClient.request<PastEventDetailsQueryProps>(
      PastEventDetailsQueryDocument as any,
      {
        startItem: startItem,
        excludedItem: excludeCurrentItem,
        templateId: EastIDs.PAST_EVENT_DETAIL_TEMPLATE,
        language: language,
        todayDate: `${year}${month}${day}T000000Z`,
        hasLayout: 'true',
        afterCursor: afterCursor,
      }
    );
  }

  pastEventDetails.push(...result.search.results);

  return pastEventDetails;
};
