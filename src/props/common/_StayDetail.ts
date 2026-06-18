import { ImageField, LinkField, RichTextField, TextField } from '@sitecore-jss/sitecore-jss-nextjs';
import { _cta } from './_cta';
import {
  _ArticleTagFields,
  _SimplePageFields,
  _SimplePageGraphQLFields,
} from '@/props/Core/PageProps';
import { RoomFeature } from '@/props/DataTemplate/RoomFeature';
import { Treelist } from '../fields/ScField';
import { RoomAmenities } from '@/props/DataTemplate/RoomAmenities';
import { _Image } from './_Image';

export interface _StayDetail extends _SimplePageFields {
  RoomSize: TextField;
  BedSize: TextField;
  FloorPlan: ImageField;
  Capacity: TextField;
  RoomListingImage: ImageField;
  RoomImages: Treelist<_Image>[];
  RoomType: TextField;
  RoomView: TextField;
  FeatureDescription: TextField;
  FeatureList: Treelist<RoomFeature>[];
  AmenitiesList: Treelist<RoomAmenities>[];
  VirtualTourLink: LinkField;
  HotelId: TextField;
  RoomCategory: TextField;
}

export interface _StayDetailGraphQL extends _SimplePageGraphQLFields {
  roomListingImage: ImageField;
}
