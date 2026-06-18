import { _ArticleCard, _ArticleCardGraphQL } from '@/props/common/_ArticleCard';
import { _HappeningGraphQL } from '@/props/common/_Happening';
import { _StayDetail, _StayDetailGraphQL } from '@/props/common/_StayDetail';
import { GraphQlSearch } from './GraphQlSearchProps';

export type RoomDetailsField = _StayDetailGraphQL & {
  id: string;
  name: string;
  url: {
    url: string;
    path: string;
  };
  language: {
    name: string;
  };
}

export type RoomDetailsQueryProps = GraphQlSearch<Array<RoomDetailsField>> & {};
