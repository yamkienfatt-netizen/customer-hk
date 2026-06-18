import React from 'react';
import { LinkFieldValue } from '@sitecore-jss/sitecore-jss-dev-tools';
import {
  Link as ScLink,
  LinkField,
  useSitecoreContext,
  LayoutServicePageState,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { useI18n } from 'next-localization';
import { GetLocaleUrl, SitecoreLanguageToURLMapping } from '@/utilities/LanguageUtilities';
import ComponentError from 'components/easthotels/Error/ComponentError';
import { cn } from 'lib/utils';

type LinkProps = {
  field: LinkField;
  className?: string;
  children?: React.ReactNode;
  editable?: boolean;
};

export const SitecoreLink = ({ children, className, field, editable = true }: LinkProps) => {
  try {
    const { sitecoreContext } = useSitecoreContext();
    const { locale } = useI18n();
    const isPageEditing =
      sitecoreContext.pageState === LayoutServicePageState.Edit;
    const isEmptyLink = field.value?.href?.length === 0;
    const convertedLinkField = Object.assign({}, field);

    if (!convertedLinkField.value?.href?.startsWith('http')) {
      let isInternalLink = false;

      if (field?.value.linktype && field?.value.linktype?.toString() == 'internal') {
        isInternalLink = true;
      }

      if (!isPageEditing && isInternalLink) {
        convertedLinkField.value.href = GetLocaleUrl(
          convertedLinkField.value.href!,
          locale()
        ).toLowerCase();
      }
    }

    return isPageEditing ? (
      <ScLink
        field={field}
        className={cn(isEmptyLink && 'pointer-events-none', className)}
        editable={editable}
      >
        {children}
      </ScLink>
    ) : isEmptyLink ? (
      <a className={cn(isEmptyLink && 'pointer-events-none', className)}>{children}</a>
    ) : (
      <ScLink
        field={convertedLinkField}
        className={cn(isEmptyLink && 'pointer-events-none', className)}
      >
        {children}
      </ScLink>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};
