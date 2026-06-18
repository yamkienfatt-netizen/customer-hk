import { _ArticleCardGraphQL } from '@/props/common/_ArticleCard';
import { _HappeningGraphQL } from '@/props/common/_Happening';
import { RoomDetailsField, RoomDetailsQueryProps } from '@/props/Graphql/RoomDetailsQueryProps';
import clientFactory from 'lib/graphql-client-factory';

//Ref: https://sitecore-nextjs-guide.hakmeng.com/graphql/connected-mode

const RoomDetailsQueryDocument = /* GraphQL */ `
  query RoomDetailsQuery(
    $startItem: String!
    $templateId: String!
    $language: String!
    $hasLayout: String!
    $afterCursor: String
  ) {
    search(
      where: {
        AND: [
          { name: "_templates", value: $templateId, operator: CONTAINS }
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
        roomListingImage: field(name: "roomListingImage") {
          value
          jsonValue
        }
        title: field(name: "title") {
          value
          jsonValue
        }
      }
    }
  }
`;

export const GetRoomDetailsService = async (
  startItem: string,
  templateId: string,
  language: string,
  afterCursor: string
): Promise<Array<RoomDetailsField>> => {
  const graphQLClient = clientFactory({});

  const rooms = [];

  let result = await graphQLClient.request<RoomDetailsQueryProps>(RoomDetailsQueryDocument as any, {
    startItem: startItem,
    templateId: templateId,
    language: language,
    hasLayout: 'true',
    afterCursor: afterCursor,
  });

  rooms.push(...result.search.results);

  while (result.search.pageInfo.hasNext) {
    result = await graphQLClient.request<RoomDetailsQueryProps>(RoomDetailsQueryDocument as any, {
      startItem: startItem,
      templateId: templateId,
      language: language,
      hasLayout: 'true',
      afterCursor: result.search.pageInfo.endCursor,
    });
    rooms.push(...result.search.results);
  }

  return rooms;
};
