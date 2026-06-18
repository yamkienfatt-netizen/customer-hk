import {
  ItwutEventDetailsField,
  ItwutEventDetailsQueryProps,
} from '@/props/Graphql/ItwutEventDetailsQueryProps';
import { _ArticleCardGraphQL } from '@/props/common/_ArticleCard';
import { _HappeningGraphQL } from '@/props/common/_Happening';
import { EastIDs } from '@/utilities/EastIdsConstant';
import clientFactory from 'lib/graphql-client-factory';

//Ref: https://sitecore-nextjs-guide.hakmeng.com/graphql/connected-mode

const ItwutEventDetailsQueryDocument = /* GraphQL */ `
  query ITWUTEventDetailsQuery(
    $startItem: String!
    $language: String!
    $hasLayout: String!
    $afterCursor: String
  ) {
    search(
      where: {
        AND: [
          { name: "_templates", value: "2716ACAF-FBEE-452D-A851-EBD98F71FCBD", operator: CONTAINS }
          { name: "_path", value: $startItem, operator: CONTAINS }
          { name: "_language", value: $language }
          { name: "_hasLayout", value: $hasLayout }
        ]
      }
      after: $afterCursor
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
        ancestors(includeTemplateIDs: "4B69DC5E-7DB1-434F-BF88-B45F9C0EE541") {
          ... on EventDateFolder {
            year {
              value
              jsonValue
            }
          }
        }
        ... on ITWUTEventDetailsPage {
          legend {
            value
            jsonValue
          }
          legend2 {
            value
            jsonValue
          }
          location {
            value
            jsonValue
          }
          date {
            value
            jsonValue
          }
          time {
            value
            jsonValue
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
          content {
            value
            jsonValue
          }
          image: field(name: "Image") {
            ... on ImageField {
              value
              jsonValue
            }
          }
          eventDate {
            value
            jsonValue
          }
        }
      }
    }
  }
`;

const ItwutEventZhDetailsQueryDocument = /* GraphQL */ `
  query ITWUTEventZhDetailsQuery(
    $startItem: String!
    $excludeMIItemPath: String!
    $language: String!
    $hasLayout: String!
    $afterCursor: String
  ) {
    search(
      where: {
        AND: [
          { name: "_templates", value: "2716ACAF-FBEE-452D-A851-EBD98F71FCBD", operator: CONTAINS }
          { name: "_path", value: $startItem, operator: CONTAINS }
          { name: "_language", value: $language }
          { name: "_hasLayout", value: $hasLayout }
          { name: "_path", value: $excludeMIItemPath, operator: NCONTAINS }
        ]
      }
      after: $afterCursor
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
        ancestors(includeTemplateIDs: "4B69DC5E-7DB1-434F-BF88-B45F9C0EE541") {
          ... on EventDateFolder {
            year {
              value
              jsonValue
            }
          }
        }
        ... on ITWUTEventDetailsPage {
          legend {
            value
            jsonValue
          }
          legend2 {
            value
            jsonValue
          }
          location {
            value
            jsonValue
          }
          date {
            value
            jsonValue
          }
          time {
            value
            jsonValue
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
          content {
            value
            jsonValue
          }
          image: field(name: "Image") {
            ... on ImageField {
              value
              jsonValue
            }
          }
          eventDate {
            value
            jsonValue
          }
        }
      }
    }
  }
`;

const ItwutEventEsPtDetailsQueryDocument = /* GraphQL */ `
  query ITWUTEventEsPtDetailsQuery(
    $startItem: String!
    $excludeHKItemPath: String!
    $excludeBJItemPath: String!
    $language: String!
    $hasLayout: String!
    $afterCursor: String
  ) {
    search(
      where: {
        AND: [
          { name: "_templates", value: "2716ACAF-FBEE-452D-A851-EBD98F71FCBD", operator: CONTAINS }
          { name: "_path", value: $startItem, operator: CONTAINS }
          { name: "_language", value: $language }
          { name: "_hasLayout", value: $hasLayout }
          { name: "_path", value: $excludeHKItemPath, operator: NCONTAINS }
          { name: "_path", value: $excludeBJItemPath, operator: NCONTAINS }
        ]
      }
      after: $afterCursor
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
        ancestors(includeTemplateIDs: "4B69DC5E-7DB1-434F-BF88-B45F9C0EE541") {
          ... on EventDateFolder {
            year {
              value
              jsonValue
            }
          }
        }
        ... on ITWUTEventDetailsPage {
          legend {
            value
            jsonValue
          }
          legend2 {
            value
            jsonValue
          }
          location {
            value
            jsonValue
          }
          date {
            value
            jsonValue
          }
          time {
            value
            jsonValue
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
          content {
            value
            jsonValue
          }
          image: field(name: "Image") {
            ... on ImageField {
              value
              jsonValue
            }
          }
          eventDate {
            value
            jsonValue
          }
        }
      }
    }
  }
`;

export const GetITWUTEventDetailsService = async (
  startItem: string,
  language: string,
  afterCursor: string
): Promise<Array<ItwutEventDetailsField>> => {
  console.log(`GetITWUTEventDetailsService ${language}`);
  if (language == 'es' || language == 'pt') {
    return await GetEsPtDetails(startItem, language, afterCursor);
  } else if (language.startsWith('zh')) {
    return await GetZhDetails(startItem, language, afterCursor);
  } else {
    return await GetEnDetails(startItem, language, afterCursor);
  }
};

const GetEnDetails = async (
  startItem: string,
  language: string,
  afterCursor: string
): Promise<Array<ItwutEventDetailsField>> => {
  const events = [];
  const graphQLClient = clientFactory({});

  let result = await graphQLClient.request<ItwutEventDetailsQueryProps>(
    ItwutEventDetailsQueryDocument as any,
    {
      startItem: startItem,
      language: language,
      hasLayout: 'true',
      afterCursor: afterCursor,
    }
  );

  events.push(...result.search.results);

  while (result.search.pageInfo.hasNext) {
    result = await graphQLClient.request<ItwutEventDetailsQueryProps>(
      ItwutEventDetailsQueryDocument as any,
      {
        startItem: startItem,
        language: language,
        hasLayout: 'true',
        afterCursor: result.search.pageInfo.endCursor,
      }
    );
    events.push(...result.search.results);
  }

  return events;
};

const GetZhDetails = async (
  startItem: string,
  language: string,
  afterCursor: string
): Promise<Array<ItwutEventDetailsField>> => {
  const events = [];
  const graphQLClient = clientFactory({});

  let result = await graphQLClient.request<ItwutEventDetailsQueryProps>(
    ItwutEventZhDetailsQueryDocument as any,
    {
      startItem: startItem,
      language: language,
      hasLayout: 'true',
      afterCursor: afterCursor,
      excludeMIItemPath: EastIDs.EASTMIAMI_ROOT_ITEM,
    }
  );

  events.push(...result.search.results);

  while (result.search.pageInfo.hasNext) {
    result = await graphQLClient.request<ItwutEventDetailsQueryProps>(
      ItwutEventZhDetailsQueryDocument as any,
      {
        startItem: startItem,
        language: language,
        hasLayout: 'true',
        afterCursor: result.search.pageInfo.endCursor,
        excludeMIItemPath: EastIDs.EASTMIAMI_ROOT_ITEM,
      }
    );
    events.push(...result.search.results);
  }

  return events;
};

const GetEsPtDetails = async (
  startItem: string,
  language: string,
  afterCursor: string
): Promise<Array<ItwutEventDetailsField>> => {
  const events = [];
  const graphQLClient = clientFactory({});

  let result = await graphQLClient.request<ItwutEventDetailsQueryProps>(
    ItwutEventEsPtDetailsQueryDocument as any,
    {
      startItem: startItem,
      language: language,
      hasLayout: 'true',
      afterCursor: afterCursor,
      excludeHKItemPath: EastIDs.EASTHONGKONG_ROOT_ITEM,
      excludeBJItemPath: EastIDs.EASTBEIJING_ROOT_ITEM,
    }
  );

  events.push(...result.search.results);

  while (result.search.pageInfo.hasNext) {
    result = await graphQLClient.request<ItwutEventDetailsQueryProps>(
      ItwutEventEsPtDetailsQueryDocument as any,
      {
        startItem: startItem,
        language: language,
        hasLayout: 'true',
        afterCursor: result.search.pageInfo.endCursor,
        excludeHKItemPath: EastIDs.EASTHONGKONG_ROOT_ITEM,
        excludeBJItemPath: EastIDs.EASTBEIJING_ROOT_ITEM,
      }
    );
    events.push(...result.search.results);
  }

  return events;
};
