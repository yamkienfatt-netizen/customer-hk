import Image from 'next/image';
import Typography from '../Typography/Typography';
import { useI18n } from 'next-localization';
// import CTAButton from '../Button/CTAButton';
import { Button, buttonVariants } from 'components/ui/button';
import Link from 'next/link';
import { cn } from 'lib/utils';
import { HtmlLink } from '../CustomTypes/Components/HtmlLink';
import { useSitecoreContext, Image as ScImage, Text as ScText } from '@sitecore-jss/sitecore-jss-nextjs';
import { PageRouteFields, _SimplePageFields } from '@/props/Core/PageProps';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';

const Default = () => {
  const context = useSitecoreContext();

  const { route } = context.sitecoreContext;
  const pageFields = route?.fields as PageRouteFields & _SimplePageFields;
  const { t } = useI18n();

  return (
    <div className={'flex w-full lg:py-14  flex-wrap'}>
      <div className={'relative aspect-[1.22] basis-full lg:basis-1/2'}>
        <ScImage field={pageFields.Image} alt="404" className={'object-cover w-full h-full'} fill />
      </div>
      <div className={'container flex flex-1 flex-col items-start justify-center py-14'}>
        <Typography variant="h2" className={'mb-6 text-left uppercase xl:mb-8'}>
          <ScText field={pageFields.Title} />
        </Typography>
        <Typography variant="p" className={'mb-6 text-left xl:mb-8'}>
          <ScText field={pageFields.Description} />
        </Typography>
        <HtmlLink href="/" className={cn(buttonVariants(), 'bg-green-primary leading-none font-bold')}>
          {t(DICTIONARY_CONSTANT.GENERAL.ERROR_404_BACK_TO_HOME)}
        </HtmlLink>
      </div>
    </div>
  );
};

export default Default;
