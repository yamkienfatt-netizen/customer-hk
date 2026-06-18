import { _ArticleCard, _ArticleCardGraphQL } from '@/props/common/_ArticleCard';
import { _HappeningGraphQL } from '@/props/common/_Happening';
import { _StayDetail, _StayDetailGraphQL } from '@/props/common/_StayDetail';
import { GraphQlSearch } from './GraphQlSearchProps';
import { _VenueDetailGraphQL } from '@/props/common/_VenueDetail';

export type VenueDetailsField = _VenueDetailGraphQL & {
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

export type VenueDetailsQueryProps = GraphQlSearch<Array<VenueDetailsField>> & {};
