import { _ArticleCardGraphQL } from '@/props/common/_ArticleCard';
import { _HappeningGraphQL } from '@/props/common/_Happening';
import { VenueDetailsField, VenueDetailsQueryProps } from '@/props/Graphql/VenueDetailsQueryProps';
import clientFactory from 'lib/graphql-client-factory';

//Ref: https://sitecore-nextjs-guide.hakmeng.com/graphql/connected-mode

const VenueDetailsQueryDocument = /* GraphQL */ `
  query VenueDetailsQuery(
    $startItem: String!
    $language: String!
    $hasLayout: String!
    $afterCursor: String
  ) {
    search(
      where: {
        AND: [
          { name: "_templates", value: "4A02B94E-B368-499E-B1DA-C429F871436D", operator: CONTAINS }
          { name: "_path", value: $startItem, operator: CONTAINS }
          { name: "_language", value: $language }
          { name: "_hasLayout", value: $hasLayout }
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
        title: field(name: "title") {
          value
          jsonValue
        }
        image: field(name: "image") {
          value
          jsonValue
        }
        venueSize: field(name: "venueSize") {
          value
          jsonValue
        }
        capacity: field(name: "capacity") {
          value
          jsonValue
        }
        roomTag: field(name: "RoomTag") {
          value
          jsonValue
        }
      }
    }
  }
`;

export const GetVenueDetailsService = async (
  startItem: string,
  language: string,
  afterCursor: string
): Promise<Array<VenueDetailsField>> => {
  const graphQLClient = clientFactory({});

  const rooms = [];

  let result = await graphQLClient.request<VenueDetailsQueryProps>(
    VenueDetailsQueryDocument as any,
    {
      startItem: startItem,
      language: language,
      hasLayout: 'true',
      afterCursor: afterCursor,
    }
  );

  rooms.push(...result.search.results);

  while (result.search.pageInfo.hasNext) {
    result = await graphQLClient.request<VenueDetailsQueryProps>(VenueDetailsQueryDocument as any, {
      startItem: startItem,
      language: language,
      hasLayout: 'true',
      afterCursor: result.search.pageInfo.endCursor,
    });
    rooms.push(...result.search.results);
  }

  return rooms;
};
