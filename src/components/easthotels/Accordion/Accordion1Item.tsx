import React, { useEffect, useRef } from 'react';
import Typography from '../Typography/Typography';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Element } from 'react-scroll';
import { AccordionItemProps } from '@/props/PageContent/Accordion1Props';
import {
  withDatasourceCheck,
  Text as ScText,
  Image as ScImage,
  Placeholder as ScPlaceholder,
  useSitecoreContext,
  LayoutServicePageState,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { _SimpleText } from '@/props/common/_SimpleText';
import { useSelector, useDispatch } from 'react-redux';
import { getAccordionState } from 'lib/redux/features/accordionNavigation';
import { setAccordionState } from 'lib/redux/features/accordionNavigation';
import ComponentError from '../Error/ComponentError';
import { cn, getAccordionItemNameForScroller } from 'lib/utils';
import Image from 'next/image';

const publicUrl = getPublicUrl();
const Accordion1Item = (accordionItemProps: AccordionItemProps) => {
  try {
    const ref = useRef<HTMLElement>();
    const { sitecoreContext } = useSitecoreContext();
    const isPageEditing = sitecoreContext.pageState === LayoutServicePageState.Edit;

    const accordionState: any = useSelector(getAccordionState);

    const { ids } = useSelector((state: any) => state.accordion);

    const dispatch = useDispatch();

    const accordion1ItemPlaceholderKey = `accordion1item-${accordionItemProps.params?.DynamicPlaceholderId ?? '{*}'}`;

    const parentNode = ref.current?.parentNode as HTMLElement;
    const index = parentNode
      ? String((Array.from(parentNode.children).indexOf(ref.current as HTMLElement) - 1) / 2)
      : undefined;

    // const isExpanded = ids.includes(index);

    const locationText = ['location', '地址'];
    const fieldTitle = (accordionItemProps?.fields?.Title?.value as string).toLowerCase() || '';
    const engFieldTitle = fieldTitle === locationText[1] ? locationText[0] : fieldTitle;

    const openLocationAnchor = locationText.includes(window.location?.hash.slice(1));
    const isLocationField = locationText.includes(fieldTitle);

    const onItemClicked = (id: string) => {
      // if (ids.includes(index)) {
      if (ids.includes(id)) {
        // dispatch(setAccordionState(ids.filter((item: string) => item !== index)));
        dispatch(setAccordionState(ids.filter((item: string) => item !== id)));
      } else {
        // dispatch(setAccordionState([...ids, index]));
        dispatch(setAccordionState([...ids, id]));
      }
    };

    useEffect(() => {
      if (openLocationAnchor && isLocationField) {
        const element = document.getElementById(engFieldTitle);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }
    }, []);

    const getIDWithoutBracesAndLowercase = (currID: string) => {
      return currID.replace(/[{}]/g, '').toLowerCase();
    };

    const currIDWithoutBraces = getIDWithoutBracesAndLowercase(
      accordionItemProps.rendering.dataSource!
    );

    const isExpanded = ids.includes(currIDWithoutBraces);

    return (
      <>
        <div>
          {/* {index !== undefined && <Element name={getAccordionItemNameForScroller(index)}></Element>} */}
          {currIDWithoutBraces !== undefined && (
            <Element name={getAccordionItemNameForScroller(currIDWithoutBraces)}></Element>
          )}
        </div>
        {!isPageEditing && (
          // <Accordion
          //   type="single"
          //   id={engFieldTitle}
          //   collapsible
          //   className="w-full"
          //   ref={ref}
          //   defaultValue={openLocationAnchor && isLocationField ? '0' : undefined}
          // >
          <AccordionItem
            // value={index || ''}
            value={currIDWithoutBraces}
            key={currIDWithoutBraces}
            className={cn('border-b border-[#707070]', accordionItemProps.params?.Styles || '')}
          >
            {/* <hr className="w-full border-[#CFCFCF]" /> */}
            <AccordionTrigger className={'w-full py-[15px] text-left lg:py-[20px]'}>
              <div
                //items-center
                className="flex w-full  justify-between"
                // onClick={() => onItemClicked( accordionItemProps.rendering.dataSource!)}
                onClick={() => onItemClicked(currIDWithoutBraces)}
              >
                {!isExpanded && accordionItemProps?.fields?.Image?.value?.src && (
                  <div className="hidden aspect-[1.6] w-full flex-1 lg:mr-[30px] lg:block">
                    <ScImage
                      field={accordionItemProps.fields.Image}
                      className={'h-full w-full object-cover'}
                    />
                  </div>
                )}

                <div className="flex-1">
                  <Typography variant="h3" extraStyles="lg:mb-0" font="Bellefair">
                    <ScText field={accordionItemProps.fields.Title} />
                  </Typography>

                  {!isExpanded && (
                    <>
                      {accordionItemProps.fields?.Image?.value?.src && (
                        <div className="aspect-[1.69] w-full flex-1 lg:hidden">
                          <ScImage
                            field={accordionItemProps.fields.Image}
                            className={'mt-[25px] h-full w-full object-cover'}
                          />
                        </div>
                      )}

                      {accordionItemProps.fields?.Description.value && (
                        <Typography variant="p" extraStyles="mt-[25px] lg:mt-[30px]">
                          <ScText field={accordionItemProps.fields.Description} />
                        </Typography>
                      )}
                    </>
                  )}
                </div>
                <Image
                  src={`${publicUrl}/icon_arrow_down_black.svg`}
                  alt="arrow"
                  className={`ml-4 shrink-0 transition-all duration-200 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
                  width={16}
                  height={16}
                />
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div>
                <Typography variant="p">
                  <ScText field={accordionItemProps.fields.Description} />
                </Typography>
                <div className="accordion-content">
                  <ScPlaceholder
                    name={accordion1ItemPlaceholderKey}
                    rendering={accordionItemProps.rendering}
                  />
                </div>
                <div className="mb-[20px]" />
              </div>
            </AccordionContent>
          </AccordionItem>
          // </Accordion>
        )}

        {isPageEditing && (
          <>
            <span> this is page editing accordion1item</span>
            <div className="flex justify-between">
              <div className="flex-1 ">
                <Typography variant="h3" extraStyles="mb-[25px] lg:mb-0" font="Bellefair">
                  <ScText field={accordionItemProps.fields.Title} />
                </Typography>

                <div className="flex-1">
                  <ScImage field={accordionItemProps.fields.Image} />
                </div>

                <Typography variant="p" extraStyles="mt-[25px] lg:mt-[30px]">
                  <ScText field={accordionItemProps.fields.Description} />
                </Typography>
              </div>

              <Image
                src={`${publicUrl}/icon_arrow_down_black.svg`}
                alt="arrow"
                className={`ml-4 shrink-0 transition-transform duration-200 ${isExpanded && 'rotate-180'}`}
                width={16}
                height={16}
              />
            </div>

            <ScPlaceholder
              name={accordion1ItemPlaceholderKey}
              rendering={accordionItemProps.rendering}
            />
          </>
        )}
      </>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default withDatasourceCheck()<AccordionItemProps>(Accordion1Item);
