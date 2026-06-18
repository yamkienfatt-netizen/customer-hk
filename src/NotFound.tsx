import { useEffect, JSX } from 'react';
import { GetLocaleUrl, URLLanguageToSitecoreLanguageMapping } from './utilities/LanguageUtilities';
import { useI18n } from 'next-localization';

/**
 * Rendered in case if we have 404 error
 */
const NotFound = (): JSX.Element => {
  const { locale } = useI18n();
  useEffect(() => {
    const nativeWindowLocationPathName = window.location.pathname;
    const lang = nativeWindowLocationPathName.toLowerCase().split('/')[1];
    console.log(`native lang ${lang}`);
    if (lang && URLLanguageToSitecoreLanguageMapping[lang]) {
      window.location.href = GetLocaleUrl(
        '/not-found/',
        URLLanguageToSitecoreLanguageMapping[lang]
      );
    } else {
      window.location.href = GetLocaleUrl('/not-found/', locale());
    }
  }, []);

  return <></>;
};

export default NotFound;
