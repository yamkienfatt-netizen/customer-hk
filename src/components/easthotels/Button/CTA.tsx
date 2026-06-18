import React from 'react';
import CTAButton from './CTAButton';
import {
  LayoutServicePageState,
  LinkField,
  TextField,
  useSitecoreContext,
  withDatasourceCheck,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { CTAProps } from '@/props/Buttons/CTAProps';
import ComponentError from '../Error/ComponentError';
import { cn } from 'lib/utils';

type CTAButtonProps = {
  url?: LinkField | string;
  text: TextField | string;
  variant?: 'contained-small' | 'contained-big' | 'text' | 'underlined' | 'hovered-underline';
  fontColor?: string;
  bgColor?: string;
  disabled?: boolean;
  isNewWindow?: boolean;
  extraStyles?: string;
  extraContainerStyles?: string;
};

const Default = (ctaProps: CTAProps) => {
  try {
    const margin = ctaProps?.params?.Styles.includes('lg:ml-0') ? 'lg:ml-0' : '';
    const isMobileFixedCta = ctaProps?.params?.Styles.includes('mobileFixedBtn');
    const fixedContainerStyles = ctaProps?.params?.Styles.includes('mobileFixedBtn')
      ? 'fixed bottom-0 z-20 w-full lg:relative lg:z-0 lg-:w-auto'
      : '';
    const fixedExtraStyles = ctaProps?.params?.Styles.includes('mobileFixedBtn') ? 'h-[50px]' : '';
    const ctaBtnExtraContainerStyles = isMobileFixedCta
      ? 'bg-royal-green min-h-[50px] lg:bg-green-primary'
      : '';
    const buttonProps: CTAButtonProps = {
      url: ctaProps.fields.URL,
      text: ctaProps.fields.Text,
      variant: 'contained-big',
      fontColor: 'white',
      bgColor: 'green-primary', // ask wen whether need fixed bg + font color options for user
      // disabled: false,
      isNewWindow: false,
      extraContainerStyles: cn('lg:max-w-[300px]', fixedExtraStyles), // user should have options to hide in mobile, or hide in desktop,  left align & right align
    };
    const align = 'lg:max-w-[300px]' + margin;
    const hasValue = ctaProps.fields.URL.value.href && ctaProps.fields.Text.value;
    const { sitecoreContext } = useSitecoreContext();
    const isPageEditing = sitecoreContext.pageState === LayoutServicePageState.Edit;

    if (isPageEditing || hasValue) {
      return (
        <div className={cn('lg:mx-auto mt-2', align, fixedContainerStyles)}>
          <CTAButton {...buttonProps} extraContainerStyles={ctaBtnExtraContainerStyles} />
        </div>
      );
    } else {
      return <></>;
    }
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default withDatasourceCheck()<CTAProps>(Default);
