import React, { useEffect, useState } from 'react';
import { Accordion } from '@/components/ui/accordion';
import { Accordion1Props } from '@/props/PageContent/Accordion1Props';
import {
  withDatasourceCheck,
  Placeholder as ScPlaceholder,
  Text as ScText,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { _SimpleText } from '@/props/common/_SimpleText';
import { useDispatch, useSelector } from 'react-redux';
import { getAccordionState, setAccordionState } from 'lib/redux/features/accordionNavigation';
import Typography from '../Typography/Typography';
import { scroller } from 'react-scroll';
import { _PageMetadata } from '@/props/common/_PageMetadata';
import { PageRouteFields } from '@/props/Core/PageProps';
import ComponentError from '../Error/ComponentError';
import { getAccordionItemNameForScroller } from 'lib/utils';
import useWindowSize from 'src/hooks/useWindowSize';

const Accordion1 = (accordion1Props: Accordion1Props) => {
  try {
    const [activeAccordionId, setActiveAccordionId] = useState(
      accordion1Props.fields.AccordionList[0]?.id
    );

    const accordionState: any = useSelector(getAccordionState);

    const dispatch = useDispatch();
    const { ids } = useSelector((state: any) => state.accordion);

    const { isMobile } = useWindowSize();

    useEffect(() => {
      // dispatch(setAccordionState(['0']));
      dispatch(setAccordionState([accordion1Props.fields.AccordionList[0]?.id]));
    }, []);

    const onItemClick = (id: string, index: number) => {
      scroller.scrollTo(getAccordionItemNameForScroller(index), {
        duration: 500,
        smooth: true,
        offset: isMobile ? -150 : -100,
      });

      if (activeAccordionId === id) {
        setActiveAccordionId('');
        // dispatch(setAccordionState([]));
      } else {
        setActiveAccordionId(id);
        // dispatch(setAccordionState([id]));
      }

      if (ids.includes(index + '')) {
        // dispatch(setAccordionState(ids.filter((item: string) => item !== ('' + index))));
      } else {
        dispatch(setAccordionState([...ids, '' + index]));
      }
    };
    const context = useSitecoreContext();
    const { route } = context.sitecoreContext;
    const pageFields = route?.fields as PageRouteFields & _PageMetadata;

    const accordion1PlaceholderKey = `accordion1-${accordion1Props.params.DynamicPlaceholderId ?? '{*}'}`;

    return (
      <>
        <div className="mt-[50px] lg:mt-[80px]" />
        {accordion1Props?.fields?.withStickyMobileMenu.value && (
          <div
            className={`${pageFields.IsPropertyPage ? 'bg-property' : 'bg-brand'} sticky top-0 top-[74px] z-10 flex gap-[20px] bg-property pt-[15px] backdrop-blur-xl lg:hidden lg:bg-opacity-100`}
          >
            {accordion1Props.fields.AccordionList &&
              accordion1Props.fields.AccordionList.map((item, index) => {
                const isActive = activeAccordionId === item.id;
                const fontColor = isActive ? '#1d2021' : '#888988';

                return (
                  <div
                    className="mb-[27px] flex justify-start"
                    key={item.id}
                    onClick={() => onItemClick(item.id, index)}
                  >
                    <Typography variant="l1" fontWeight="bold" fontColor={fontColor}>
                      <ScText field={item.fields.Title} />
                    </Typography>
                  </div>
                );
              })}
          </div>
        )}
        <Accordion type="multiple" value={ids}>
          <ScPlaceholder name={accordion1PlaceholderKey} rendering={accordion1Props.rendering} />
        </Accordion>
      </>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default withDatasourceCheck()<Accordion1Props>(Accordion1);
