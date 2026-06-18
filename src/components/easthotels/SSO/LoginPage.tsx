import { GetLocaleUrl, SitecoreLanguageToAzureB2CLanguageMapping } from '@/utilities/LanguageUtilities';
import { SsoApiPaths } from '@/utilities/SsoConstant';
import { signIn } from 'next-auth/react';
import { useI18n } from 'next-localization';
import { useEffect, JSX } from 'react';

const LoginPage = (): JSX.Element => {
  const { locale } = useI18n();
  useEffect(() => {
    signIn(
      'azureb2c',
      { callbackUrl: GetLocaleUrl(SsoApiPaths.SIGN_IN_CALLBACK, locale()) },
      { ui_locales: SitecoreLanguageToAzureB2CLanguageMapping[locale()] }
    );
  }, []);

  return <></>;
};

export default LoginPage;
