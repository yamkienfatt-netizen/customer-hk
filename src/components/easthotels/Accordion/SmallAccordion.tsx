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
  Placeholder as ScPlaceholder,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import { SmallAccordionProps } from '@/props/PageContent/SmallAccordionProps';
import ComponentError from '../Error/ComponentError';

const Default = (smallAccordionProps: SmallAccordionProps) => {
  try {
    const [expandedItemIndex, setExpandedItemIndex] = useState(null);
    const smallAccordionPlaceholderKey = `smallaccordion-${smallAccordionProps.params?.DynamicPlaceholderId ?? '{*}'}`;

    const toggleAccordion = (index) => {
      if (index === expandedItemIndex) {
        setExpandedItemIndex(null);
      } else {
        setExpandedItemIndex(index);
      }
    };
    const sitecoreCss = smallAccordionProps.params?.Styles ?? ''; //use this after converted

    return (
      <div className={'small-section-container !max-w-[630px] text-left' + sitecoreCss}>
        <div className="mx-[15px] lg:mx-0">
          <FadeInUp>
            <Typography variant="h2" font="Bellefair" extraStyles="text-left lg:text-center">
              <ScText field={smallAccordionProps.fields.Title} />
            </Typography>
          </FadeInUp>
          <FadeInUp>
            <div className="mt-[30px] lg:mt-[80px]">
              <hr className="my-[10px]" />
              <Accordion type="single" collapsible className="w-full">
                <ScPlaceholder
                  name={smallAccordionPlaceholderKey}
                  rendering={smallAccordionProps.rendering}
                />
              </Accordion>
            </div>
          </FadeInUp>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default withDatasourceCheck()<SmallAccordionProps>(Default);
