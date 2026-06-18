import Image from 'next/image';
import Typography from '../Typography/Typography';
import { useI18n } from 'next-localization';
// import CTAButton from '../Button/CTAButton';
import { Button, buttonVariants } from 'components/ui/button';
import Link from 'next/link';
import { cn } from 'lib/utils';
import { HtmlLink } from '../CustomTypes/Components/HtmlLink';
import {
  useSitecoreContext,
  Image as ScImage,
  Text as ScText,
  RichText as ScRichText,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { PageRouteFields, _SimplePageFields } from '@/props/Core/PageProps';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import { GetLocaleUrl } from '@/utilities/LanguageUtilities';
import { SsoApiPaths } from '@/utilities/SsoConstant';

const Default = () => {
  const context = useSitecoreContext();

  const { route } = context.sitecoreContext;
  const pageFields = route?.fields as PageRouteFields & _SimplePageFields;
  const { t, locale } = useI18n();
  const showCTA = process.env.SHOW_LOGIN_ERROR_CTA === 'true';

  return (
    <div className={'flex w-full flex-wrap  lg:py-14'}>
      <div className={'relative aspect-[1.22] basis-full lg:basis-1/2'}>
        <ScImage field={pageFields.Image} alt="404" className={'h-full w-full object-cover'} fill />
      </div>
      <div className={'container flex flex-1 flex-col items-start justify-center py-14'}>
        <Typography variant="h2" className={'mb-6 text-left uppercase xl:mb-8'}>
          <ScText field={pageFields.Title} />
        </Typography>
        <Typography variant="p" className={'mb-6 text-left xl:mb-8'}>
          <ScRichText field={pageFields.Content} />
        </Typography>
        {showCTA && (
          <HtmlLink
            href={GetLocaleUrl(SsoApiPaths.SIGN_IN_PAGE, locale())}
            className={cn(buttonVariants(), 'bg-green-primary font-bold leading-none')}
          >
            {t(DICTIONARY_CONSTANT.SSO.Global.LOGIN_ERROR_BACK_TO_LOGIN)}
          </HtmlLink>
        )}
      </div>
    </div>
  );
};

export default Default;
