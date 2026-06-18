import { _CarouselBanner } from '@/props/common/_CarouselBanner';
import { _MultiHeadings } from '@/props/common/_MultiHeadings';
import { _SimpleText } from '@/props/common/_SimpleText';
import { Treelist } from '@/props/fields/ScField';
import { ComponentProps } from 'lib/component-props';
import { Banner } from '../DataTemplate/Banner';
import { SelectedArticle } from '../PageContent/Article2Prop';
import { Field, TextField } from '@sitecore-jss/sitecore-jss-nextjs';
import { _StayDetail } from '@/props/common/_StayDetail';
import { PropertySiteConfigurationProp } from '../SiteConfigurationProp';
import { _Image } from '@/props/common/_Image';
import { _ArticleCard } from '@/props/common/_ArticleCard';
import { _MultiHeadingBannerWithCta } from '@/props/common/_MultiHeadingBannerWithCta';
import { _SimplePageFields } from '../Core/PageProps';
import { _PositionalImages } from '@/props/common/_PositionalImages';

export type CarouselBanner1Field = _MultiHeadingBannerWithCta & {
  SelectedProperties: Treelist<_ArticleCard>[];
  IsPropertyInnerPage: Field<boolean>;
  IsBrandInnerPage: Field<boolean>;
};

export type CarouselBanner2Field = _MultiHeadingBannerWithCta & {
  SelectedOffers: Treelist<_ArticleCard>[];
};

export interface CarouselBanner3Field extends _MultiHeadings {
  SelectedArticles: Treelist<Banner>[];
}

export interface CarouselBanner4Field extends _MultiHeadings {
  SelectedArticles: SelectedArticle[];
  IsPropertyInnerPage: Field<boolean>;
  IsBrandInnerPage: Field<boolean>;
}

export interface CarouselBanner5Field {
  SelectedArticles: Treelist<_StayDetail>[];
  CTAText: TextField;
  PropertySiteConfiguration: PropertySiteConfigurationProp;
}

export type CarouselBanner6Field = {
  SelectedBannerImages: Treelist<_Image>[];
  IsPropertyInnerPage: Field<boolean>;
  IsBrandInnerPage: Field<boolean>;
};

export interface CarouselBanner7Field {
  SelectedImages: Treelist<_Image>[];
}

export interface CarouselBanner9Field {
  SelectedImages: Treelist<_Image>[];
}

type CarouselBanner10Item = _SimplePageFields & _PositionalImages;

export type CarouselBanner10Field = {
  SelectedArticles: Treelist<CarouselBanner10Item>[];
  CTAText: TextField;
};

export type CarouselBannerProps = ComponentProps & {
  fields: _CarouselBanner<_SimpleText>;
};

export type CarouselBanner1Prop = {
  fields: CarouselBanner1Field;
};

export type CarouselBanner2Props = {
  fields: CarouselBanner2Field;
};

export type CarouselBanner3Props = ComponentProps & {
  fields: CarouselBanner3Field;
};

export type CarouselBanner4Props = ComponentProps & {
  fields: CarouselBanner4Field;
};

export type CarouselBanner5Props = ComponentProps & {
  fields: CarouselBanner5Field;
};

export type CarouselBanner6Props = ComponentProps & {
  fields: CarouselBanner6Field;
};

export type CarouselBanner7Props = ComponentProps & {
  fields: CarouselBanner7Field;
};

export type CarouselBanner9Props = ComponentProps & {
  fields: CarouselBanner9Field;
};

export type CarouselBanner10Props = ComponentProps & {
  fields: CarouselBanner10Field;
};
