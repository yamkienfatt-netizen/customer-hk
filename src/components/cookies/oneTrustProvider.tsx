// components/OneTrustProvider.tsx
import Script from 'next/script';

interface OneTrustProviderProps {
  locale: string;
}

const _getScriptId = (): string => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname.includes('uat')) {
      return '018f27e1-8923-7059-a256-946a8fa851db-test';
    }
  }

  const env = process.env.NODE_ENV || process.env.VERCEL_ENV;

  if (env === 'production') {
    return '018f27e1-8923-7059-a256-946a8fa851db';
  }

  return '018f27e1-8923-7059-a256-946a8fa851db-test';
};

const _getOneTrustLanguageByLocale = (locale: string): string => {
  if (locale === 'tc') {
    return 'zh-hk';
  } else if (locale === 'sc') {
    return 'zh-cn';
  }
  return locale;
};

export const OneTrustProvider = ({ locale }: OneTrustProviderProps) => {
  const language = _getOneTrustLanguageByLocale(locale);

  return (
    <Script
      src="https://cdn-apac.onetrust.com/scripttemplates/otSDKStub.js"
      data-language={language}
      type="text/javascript"
      data-domain-script={_getScriptId()}
    />
  );
};
