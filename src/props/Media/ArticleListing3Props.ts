import { ComponentProps } from 'lib/component-props';
import { _BannerWithCta } from '../common/_BannerWithCta';
import { _Image } from '../common/_Image';
import { Treelist } from '../fields/ScField';
import { EastStoriesDetailProps } from '@/props/Core/EastStoriesDetailProps';
import { TextField } from '@sitecore-jss/sitecore-jss-nextjs';

export type ArticleListing3Field = {
  SelectedArticles: Treelist<{
    fields: EastStoriesDetailProps
  }>[];
  ArticleCTALabel: TextField;
}


export type ArticleListing3Props = ComponentProps & {
  fields: ArticleListing3Field;
};
