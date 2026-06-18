import { _ArticleCard, _ArticleCardGraphQL } from '@/props/common/_ArticleCard';
import { _HappeningGraphQL } from '@/props/common/_Happening';
import { _StayDetail, _StayDetailGraphQL } from '@/props/common/_StayDetail';
import { GraphQlSearch } from './GraphQlSearchProps';
import { ImageField, Field } from '@sitecore-jss/sitecore-jss-nextjs';

export type RoomImagesField = {
  id: string;
  name: string;
  Type: string;
  Key: {
    jsonValue: Field<string>;
  };
  Value: {
    jsonValue: Field<string>;
  };
  Image: {
    jsonValue: ImageField;
  };
};

export type RoomImagesQueryProps = GraphQlSearch<Array<RoomImagesField>> & {};

export type RoomImagesProps = {
  HotelName: string;
  RoomType: string;
  RoomImage: ImageField;
};
