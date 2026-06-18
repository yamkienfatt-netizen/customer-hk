import { Field, ImageField, LinkField } from '@sitecore-jss/sitecore-jss-nextjs';

export interface BannerProps {
  fields: Banner;
  click: () => void;
}
export interface CarouselBannerProps {
  fields: MemberOffersBanner;
}
export interface Banner {
  Image: ImageField;
  Heading: Field<string>;
  Title: Field<string>;
  Description: Field<string>;
  LinkText: Field<string>;
  Link: MemberOffersDetailProps;

  OfferTitle: Field<string>;
}
export interface MemberOffersBanner {
  Image: ImageField;
  Heading: Field<string>;
  Title: Field<string>;
  Description: Field<string>;
  LinkText: Field<string>;
  Link: LinkField;

  OfferTitle: Field<string>;
}

export interface MemberOffersDetailProps {
  fields: MemberOffersDetailItem;
  id: string;
}
export interface MemberOffersDetailItem {
  Image: ImageField;
  Heading: Field<string>;
  Title: Field<string>;
  SectionList: Array<MemberOfferSectionProps>;
  HotelId: HotelIdProps;
}
export interface HotelIdProps {
  fields: HotelIdItem;
}
export interface HotelIdItem {
  Location: Field<string>;
  HotelId: Field<string>;
}
export interface MemberOfferSectionProps {
  fields: MemberOfferSectionItem;
}
export interface MemberOfferSectionItem {
  Heading: Field<string>;
  Title: Field<string>;
  Image: ImageField;
  Description: Field<string>;
  LinkText: Field<string>;
  //Link: LinkField;
  Subtitle: Field<string>;
  DescriptionList: Field<string>;

  OfferTitle: Field<string>;
}
export interface CardProps {
  fields: Card;
  id: string;
  hotel: string;
  click: () => void;
}
export interface Card {
  Image: ImageField;
  Title: Field<string>;
  Link: LinkField;
  LinkText: Field<string>;
  ItemLink: MemberOffersDetailProps;

  OfferTitle: Field<string>;
}

export interface MemberOffersItem {
  SectionName: Field<string>;
  Description: Field<string>;
  BannerList: Array<BannerProps>;
  Title1: Field<string>;
  Description1: Field<string>;
  CardList1: Array<CardProps>;
  Heading2: Field<string>;
  Title2: Field<string>;
  Description2: Field<string>;
  Link2: LinkField;
  Link2Text: Field<string>;
  Image2: ImageField;
  Title3: Field<string>;
  Description3: Field<string>;
  CardList3: Array<CardProps>;
}
export interface MemberOffers {
  SectionName: Field<string>;
  Description: Field<string>;
  BannerList: Array<CarouselBannerProps>;
  Title1: Field<string>;
  Description1: Field<string>;
  CardList1: Array<CardProps>;
  Heading2: Field<string>;
  Title2: Field<string>;
  Description2: Field<string>;
  Link2: LinkField;
  Link2Text: Field<string>;
  Image2: ImageField;
  Title3: Field<string>;
  Description3: Field<string>;
  CardList3: Array<CardProps>;
}
