import React, { useRef } from 'react';
import { useScroll } from 'framer-motion';
import FadeInUp from '../Animation/FadeInUp';
import Typography from '../Typography/Typography';
import { _quote } from '@/props/common/_quote';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import ComponentError from '../Error/ComponentError';

const QuoteSection = ({
  Quote,
  PersonName,
  PersonJobTitle,
  type = 'default',
}: _quote & { type?: string }) => {
  try {
    const containerClassName =
      'mx-[15px] lg:mx-0 flex flex-col' + (type === 'default' ? ' lg:text-center max-w-[800px]' : '');

    const quoteColor = type === 'bg_big' || type === 'bg_small' ? 'white' : '';

    return (
      <div className={containerClassName}>
        <FadeInUp>
          <Typography variant={'h1'} font="Bellefair" fontColor={quoteColor}>
            “
          </Typography>
          <div className={'pb-[20px] lg:pb-[30px]'}>
            <Typography
              variant={type === 'bg_small' ? 'p' : 'h3'}
              font={type === 'bg_small' ? 'Amiko' : 'Bellefair'}
              fontColor={quoteColor}
            >
              <Text field={Quote} />
            </Typography>
          </div>
          {type === 'default' ? (
            <Typography variant="p" font="Amiko" fontColor={quoteColor}>
              <Text field={PersonName} />
            </Typography>
          ) : (
            <div className="flex justify-end">
              <Typography variant="p" font="Amiko" fontColor={quoteColor}>
                - <Text field={PersonName} />
              </Typography>
            </div>
          )}
          <div className={type === 'default' ? '' : 'flex justify-end'}>
            <Typography variant="l2" font="Amiko" fontColor={quoteColor}>
              <Text field={PersonJobTitle} />
            </Typography>
          </div>
        </FadeInUp>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />
  }
};

export default QuoteSection;
