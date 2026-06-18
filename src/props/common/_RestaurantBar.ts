import { ImageField, RichTextField, TextField } from '@sitecore-jss/sitecore-jss-nextjs';
import { _cta } from './_cta';
import { _ArticleTagFields, _SimplePageFields } from '@/props/Core/PageProps';
import { RoomFeature } from '@/props/DataTemplate/RoomFeature';
import { Treelist } from '../fields/ScField';
import { RoomAmenities } from '@/props/DataTemplate/RoomAmenities';
import { _Image } from './_Image';

export interface _RestaurantBar {
  ContactEmail: RichTextField;
  Location: RichTextField;
  OpeningHours: RichTextField;
}
