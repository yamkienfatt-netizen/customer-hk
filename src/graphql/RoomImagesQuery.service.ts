import { RoomImagesField, RoomImagesQueryProps } from '@/props/Graphql/RoomImagesQueryProps';
import { getCacheKey, getMemoryCache } from '@/utilities/CacheUtilities';
import clientFactory from 'lib/graphql-client-factory';

//Ref: https://sitecore-nextjs-guide.hakmeng.com/graphql/connected-mode
const ttl = 3600 * 1000;
const roomImagesCache = getMemoryCache('room-images-query', ttl);

const RoomImagesQueryDocument = /* GraphQL */ `
  query RoomImagesQuery(
    $contextItem: String!
    $language: String!
    $templateId: String!
    $afterCursor: String
    $key: String!
  ) {
    search(
      where: {
        AND: [
          { name: "_path", operator: CONTAINS, value: $contextItem }
          { name: "_language", operator: EQ, value: $language }
          { name: "_templates", operator: CONTAINS, value: $templateId }
          { name: "Key", operator: EQ, value: $key }
        ]
      }
      after: $afterCursor # first: 10
    ) {
      total
      pageInfo {
        hasNext
        endCursor
      }
      results {
        Key: field(name: "Key") {
          jsonValue
        }
        Value: field(name: "Value") {
          jsonValue
        }
        Image: field(name: "Image") {
          jsonValue
        }
      }
    }
  }
`;

export const GetRoomImagesService = async (
  startItem: string,
  templateId: string,
  language: string,
  afterCursor: string,
  key: string
): Promise<Array<RoomImagesField>> => {
  const graphQLClient = clientFactory({});

  const images = [];
  const cacheKey = getCacheKey(startItem, { templateId, language, key });
  const cacheValue = await roomImagesCache.get<Array<RoomImagesField>>(cacheKey);
  if (cacheValue) {
    console.log(`Get room images from cache, ${cacheKey}`);
    return cacheValue;
  }

  let result = await graphQLClient.request<RoomImagesQueryProps>(RoomImagesQueryDocument as any, {
    contextItem: startItem,
    templateId: templateId,
    language: language,
    afterCursor: afterCursor,
    key: key,
  });

  images.push(...result.search.results);

  while (result.search.pageInfo.hasNext) {
    result = await graphQLClient.request<RoomImagesQueryProps>(RoomImagesQueryDocument as any, {
      contextItem: startItem,
      templateId: templateId,
      language: language,
      afterCursor: result.search.pageInfo.endCursor,
    });
    images.push(...result.search.results);
  }

  await roomImagesCache.set(cacheKey, images);

  return images;
};
