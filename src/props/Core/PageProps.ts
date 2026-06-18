import { _ArticleCard } from '@/props/common/_ArticleCard';
import { _Image } from '@/props/common/_Image';
import {
  ComponentRendering,
  ImageField,
  RichTextField,
  TextField,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';

export interface PageRouteFields {
  [key: string]: unknown;
}

export interface _SimplePageFields {
  Title: TextField;
  Description: TextField;
  Content: RichTextField;
  Image: ImageField;
}

export interface _SimplePageGraphQLFields {
  title: {
    value: string;
    jsonValue: {
      value: string;
    };
  };
  description: {
    value: string;
    jsonValue: {
      value: string;
    };
  };
  content: {
    value: string;
    jsonValue: {
      value: string;
    };
  };
  image: {
    value: string;
    jsonValue: {
      value: string;
    };
  };
}

export interface _MultiHeadingSimplePageFields {
  Heading1: TextField;
  Heading2: TextField;
  Subheading: TextField;
  Description: RichTextField;
  Content: TextField;
}

export interface _ArticleTagFields {
  Title: TextField;
}

export interface BrandeNewsDetailPageFields {
  Legend: TextField;
  Legend2: TextField;
  Title: TextField;
  Description: TextField;
}

// Currently being used by Offer Detail Page
export type ArticleDetail1PageProps = ComponentProps;
