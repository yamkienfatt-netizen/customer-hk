import FadeInUp from 'components/easthotels/Animation/FadeInUp';
import React, { useState } from 'react';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import Typography from '../Typography/Typography';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'components/ui/accordion';
import RichTextTypography from '../Typography/RichTextTypography';
import {
  withDatasourceCheck,
  Text as ScText,
  RichText as ScRichText,
  Placeholder as ScPlaceholder,
  LayoutServicePageState,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import {
  SmallAccordionItemProps,
  SmallAccordionProps,
} from '@/props/PageContent/SmallAccordionProps';
import ComponentError from '../Error/ComponentError';
import Image from 'next/image';

const publicUrl = getPublicUrl();

const Default = (smallAccordionItemProps: SmallAccordionItemProps) => {
  try {
    const { sitecoreContext } = useSitecoreContext();
    const isPageEditing = sitecoreContext.pageState === LayoutServicePageState.Edit;

    const [expandedItemIndex, setExpandedItemIndex] = useState(null);
    const toggleAccordion = (index) => {
      if (index === expandedItemIndex) {
        setExpandedItemIndex(null);
      } else {
        setExpandedItemIndex(index);
      }
    };

    return (
      <AccordionItem
        value={smallAccordionItemProps.rendering.dataSource!}
        key={smallAccordionItemProps.rendering.dataSource!}
      >
        <AccordionTrigger
          className="flex cursor-pointer justify-between py-0 text-left"
          onClick={() => toggleAccordion(smallAccordionItemProps.rendering.dataSource!)}
        >
          <Typography variant="p" fontWeight="semiBold">
            <ScText field={smallAccordionItemProps.fields.Title} />
          </Typography>
          {/* <img
            src={`${publicUrl}/icon_arrow_down_black.svg`}
            alt="arrow"
            className={`ml-4 h-[8px] w-[10px] shrink-0 transition-transform duration-200 ${expandedItemIndex === index ? 'rotate-180 transform' : ''
              }`}
          /> */}
          <Image
            src={`${publicUrl}/icon_arrow_down_black.svg`}
            alt="arrow"
            className={`ml-4 shrink-0 transition-transform duration-200 [&.active]:rotate-180 ${smallAccordionItemProps.rendering.dataSource! === expandedItemIndex ? ' active' : ''}`}
            width={10}
            height={8}
          />
        </AccordionTrigger>
        <AccordionContent className="mt-[20px] ">
          {!isPageEditing && (
            <Typography variant="p" fontWeight="semiBold">
              <RichTextTypography>
                <ScRichText field={smallAccordionItemProps.fields.Content} />
              </RichTextTypography>
            </Typography>
          )}
        </AccordionContent>

        {isPageEditing && (
          <RichTextTypography>
            <ScRichText field={smallAccordionItemProps.fields.Content} />
          </RichTextTypography>
        )}

        <hr className="my-[10px]" />
      </AccordionItem>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default withDatasourceCheck()<SmallAccordionItemProps>(Default);
