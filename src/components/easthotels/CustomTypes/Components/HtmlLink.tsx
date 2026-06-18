import React from 'react';
import { useSitecoreContext, LayoutServicePageState } from '@sitecore-jss/sitecore-jss-nextjs';
import { useI18n } from 'next-localization';
import { GetLocaleUrl, SitecoreLanguageToURLMapping } from '@/utilities/LanguageUtilities';
import Link from 'next/link';

type HtmlLinkProps = {
  className?: string;
  children?: React.ReactNode;
  href: string;
  rel?: string;
  target?: string;
};

export const HtmlLink = ({ children, className, href, rel, target }: HtmlLinkProps) => {
  const { sitecoreContext } = useSitecoreContext();
  const { locale } = useI18n();
  const localeHref = GetLocaleUrl(href, locale());
  return (
    <Link
      href={localeHref}
      rel={rel}
      className={className}
      target={target}
      onClick={(e) => {
        if (localeHref.includes('mailto')) {
          return;
        }
        e.preventDefault();
        window.location.href = GetLocaleUrl(localeHref, locale());
      }}
    >
      {children}
    </Link>
  );
};
