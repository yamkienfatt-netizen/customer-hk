export const URLLanguageToSitecoreLanguageMapping = {
  en: 'en',
  sc: 'zh-CN',
  tc: 'zh-HK',
  pt: 'pt',
  es: 'es',
};

export const SitecoreLanguageToURLMapping = {
  en: 'en',
  'zh-CN': 'sc',
  'zh-HK': 'tc',
  pt: 'pt',
  es: 'es',
};

export const SitecoreLanguageToSabreLanguageMapping = {
  en: 'en-US',
  'zh-CN': 'zh-CN',
  'zh-HK': 'zh-TW',
  es: 'es-MX',
  pt: 'pt-PT',
};

export const SitecoreLanguageToCaptchaLanguageMapping = {
  en: 'en',
  'zh-CN': 'cn',
  'zh-HK': 'tw',
  es: 'en',
  pt: 'en',
};

export const SitecoreLanguageToAzureB2CLanguageMapping = {
  en: 'en',
  'zh-CN': 'zh-hans',
  'zh-HK': 'zh-hant',
  es: 'es-MX',
  pt: 'pt-PT',
};

export const BrowserTCLanguageCode = [
  'zh-Hant',
  'zh-Hant-HK',
  'zh-Hant-MO',
  'zh-Hant-TW',
  'zh-TW',
  'zh-HK',
  'zh-MO',
];

export const BrowserSCLanguageCode = [
  'zh',
  'zh-Hans',
  'zh-Hans-CN',
  'zh-Hans-HK',
  'zh-Hans-MO',
  'zh-Hans-SG',
  'zh-CN',
  'zh-SG',
];

export const UrlPathHasUrlLanguage = (urlPath: string) => {
  let hasUrlLanguage = false;
  const supportedLanguage = Object.keys(URLLanguageToSitecoreLanguageMapping);
  for (let i = 0; i < supportedLanguage.length; i++) {
    if (urlPath.toLowerCase().startsWith(`/${supportedLanguage[i]}`)) {
      hasUrlLanguage = true;
      break;
    }
  }
  return hasUrlLanguage;
};

export const GenerateLocaleUrl = (urlPath: string) => {
  // Detect the browser's preferred language
  const browserLang = navigator.language || navigator.userLanguage;
  let detectedLocale = 'en'; // fallback to 'en-US' if the browser's language is not supported

  if (BrowserSCLanguageCode.includes(browserLang)) {
    detectedLocale = 'sc';
  } else if (BrowserTCLanguageCode.includes(browserLang)) {
    detectedLocale = 'tc';
  }
  // window.location.href = `/${detectedLocale}${urlPath}`;
  return `/${detectedLocale}${urlPath}`;
};

export const GetLocaleUrl = (relativeUrl: string, locale: string) => {
  const loweredCaseUrl = relativeUrl.toLowerCase();
  if (loweredCaseUrl.startsWith('http://') || loweredCaseUrl.startsWith('https://')) {
    return relativeUrl;
  }

  relativeUrl = ConvertSitecoreChineseLocaleToSHGLocale(relativeUrl);

  const startWithLocale = `/${SitecoreLanguageToURLMapping[locale]}`;
  if (!relativeUrl?.startsWith(startWithLocale)) {
    relativeUrl = `/${SitecoreLanguageToURLMapping[locale]}${relativeUrl}`;
  }

  const [relativePath, relativeQuery] = relativeUrl.split('?');
  const toLowerCase = relativePath.toLowerCase();
  if (!toLowerCase.endsWith('/')) {
    return `${relativePath.toLowerCase()}/${relativeQuery?.length ? `?${relativeQuery}` : ''}`;
  }
  return relativePath.toLowerCase() + `${relativeQuery?.length ? `?${relativeQuery}` : ''}`;
};

export const ConvertSitecoreChineseLocaleToSHGLocale = (relativeUrl: string) => {
  let loweredCaseUrl = relativeUrl.toLowerCase();
  if (loweredCaseUrl.startsWith('/zh-hk')) {
    loweredCaseUrl = loweredCaseUrl.replace('/zh-hk', '/tc');
  } else if (loweredCaseUrl.startsWith('/zh-cn')) {
    loweredCaseUrl = loweredCaseUrl.replace('/zh-cn', '/sc');
  }
  return loweredCaseUrl;
};
