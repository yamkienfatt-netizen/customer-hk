import { _SimpleText } from '@/props/common/_SimpleText';
import { TextField } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';

export type SmallAccordionField = {
    Title: TextField;
}

export type SmallAccordionProps = ComponentProps & {
    fields: SmallAccordionField;
};


export type SmallAccordionItemProps = ComponentProps & {
    fields: _SimpleText;
};