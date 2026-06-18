import { _ArticleCard, _ArticleCardGraphQL } from '@/props/common/_ArticleCard';
import { _HappeningGraphQL } from '@/props/common/_Happening';
import { _StayDetail } from '@/props/common/_StayDetail';
import { GraphQlSearch } from './GraphQlSearchProps';

export type OfferDetailsField = _ArticleCardGraphQL & {
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

export type OfferDetailsQueryProps = GraphQlSearch<Array<OfferDetailsField>> & {};
