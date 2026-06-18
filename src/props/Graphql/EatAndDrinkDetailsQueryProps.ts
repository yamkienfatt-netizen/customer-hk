import { _ArticleCard, _ArticleCardGraphQL } from '@/props/common/_ArticleCard';
import { _HappeningGraphQL } from '@/props/common/_Happening';
import { _StayDetail, _StayDetailGraphQL } from '@/props/common/_StayDetail';
import { GraphQlSearch } from './GraphQlSearchProps';
import { _SimplePageGraphQLFields } from '../Core/PageProps';

export type EatAndDrinkDetailsField = _SimplePageGraphQLFields & {
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

export type EatAndDrinkDetailsQueryProps = GraphQlSearch<Array<EatAndDrinkDetailsField>> & {};
