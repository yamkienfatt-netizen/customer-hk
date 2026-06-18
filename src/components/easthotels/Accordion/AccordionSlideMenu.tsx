import React, { useEffect } from 'react';
import Typography from '../Typography/Typography';
import { NewsDetailDummyDataType } from '../CompositeComponents/Brand/eNewsDetail';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import { HtmlLink } from '../CustomTypes/Components/HtmlLink';
import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import {
  withDatasourceCheck,
  Placeholder as ScPlaceholder,
  Text as ScText,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { Accordion1Props } from '@/props/PageContent/Accordion1Props';
import { useDispatch, useSelector } from 'react-redux';
import { setAccordionState } from 'lib/redux/features/accordionNavigation';
import { animateScroll as scroll, scroller } from 'react-scroll';
import ComponentError from '../Error/ComponentError';
import { getAccordionItemNameForScroller } from 'lib/utils';

const Default = (accordion1Props: Accordion1Props) => {
  try {
    const accordionSlideMenuPlaceholderKey = `accordionslidemenu`;

    const dispatch = useDispatch();
    const { ids } = useSelector((state: any) => state.accordion);

    useEffect(() => {
      dispatch(setAccordionState([accordion1Props.fields.AccordionList[0]?.id]));
    }, []);

    const onItemClick = (id: string, index: number) => {
      // scroller.scrollTo(getAccordionItemNameForScroller(index), {
      scroller.scrollTo(getAccordionItemNameForScroller(id), {
        duration: 500,
        smooth: true,
        offset: -100,
      });
      // if (ids.includes(index + '')) {
      if (ids.includes(id)) {
        // dispatch(setAccordionState(ids.filter((item: string) => item !== ('' + index))));
      } else {
        // dispatch(setAccordionState([...ids, '' + index]));
        dispatch(setAccordionState([...ids, id]));
      }
    };

    return (
      <div>
        {accordion1Props.fields.AccordionList &&
          accordion1Props.fields.AccordionList.map((item, index) => {
            return (
              <div
                className="mb-[27px] flex justify-start"
                key={item.id}
                onClick={() => onItemClick(item.id, index)}
              >
                <Typography variant="l1" fontWeight="bold" hoverEffect="hoverUnderline">
                  <ScText field={item.fields.Title} />
                </Typography>
              </div>
            );
          })}

        <ScPlaceholder
          name={accordionSlideMenuPlaceholderKey}
          rendering={accordion1Props.rendering}
        />
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default withDatasourceCheck()<Accordion1Props>(Default);
