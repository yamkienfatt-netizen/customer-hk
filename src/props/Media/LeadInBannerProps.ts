import { _Image } from '@/props/common/_Image';
import { _MultiHeadingBanner } from '@/props/common/_MultiHeadingBanner';
import { _PositionalImages } from '@/props/common/_PositionalImages';
import { _Video } from '@/props/common/_Video';
import { Field, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';

export interface LeadInBanner1Field extends _MultiHeadingBanner, _PositionalImages{ }

export interface LeadInBanner2Field extends _MultiHeadingBanner, _Image, _Video {}

export type LeadInBanner1Props = {
  fields: LeadInBanner1Field;
};

export type LeadInBanner2Props = ComponentProps & {
  fields: LeadInBanner2Field;
};