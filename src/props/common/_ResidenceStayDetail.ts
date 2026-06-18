import { ImageField, RichTextField, TextField } from '@sitecore-jss/sitecore-jss-nextjs';
import { _cta } from './_cta';
import { _ArticleTagFields, _SimplePageFields } from '@/props/Core/PageProps';
import { RoomFeature } from '@/props/DataTemplate/RoomFeature';
import { Treelist } from '../fields/ScField';
import { RoomAmenities } from '@/props/DataTemplate/RoomAmenities';
import { _Image } from './_Image';
import { _StayDetail } from './_StayDetail';

export interface _ResidenceStayDetail extends _StayDetail {
    RoomTitle: TextField;
    Bedrooms: TextField;
    Bathrooms: TextField;
    Floor: TextField;

    
}