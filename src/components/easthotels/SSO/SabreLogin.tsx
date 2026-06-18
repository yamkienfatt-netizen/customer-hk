import useSabreSession from '@/hooks/useSabreSession';
import { useUrlForBookingRooms } from '@/hooks/useUrlForBookingRooms';
import {
  authOptions,
  buildAzureB2CUrl,
  ExtendedSession,
  setNextAuthCallbackUrl,
} from '@/pages/api/auth/[...nextauth]';
import { GetLocaleUrl } from '@/utilities/LanguageUtilities';
import { GetServerSideComponentProps, useComponentProps } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import { getServerSession } from 'next-auth';
import { useI18n } from 'next-localization';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

interface DataModel {
  session?: ExtendedSession;
}

export const Default = (props: ComponentProps) => {
  const { locale } = useI18n();
  const data = useComponentProps<DataModel>(props.rendering?.uid);
  const searchParams = useSearchParams();
  const hotelId = searchParams.get('hotelid') ?? '';
  const { url } = useUrlForBookingRooms({ selectedHotelId: hotelId });
  const { doSabreLogin } = useSabreSession();
  const b2cUrl = buildAzureB2CUrl(locale(), undefined);

  useEffect(() => {
    if (data?.session?.user?.access_token) {
      doSabreLogin(url, hotelId, '_self');
    } else {
      location.assign(b2cUrl);
    }
  }, [data]);

  return (
    <>
      <div id="loading-state">
        <div id="loading"></div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideComponentProps = async (
  _rendering,
  _layoutData,
  context
) => {
  context.query.cache = '0';
  let locale = context.locale?.toLowerCase() ?? 'en';
  if (locale == 'tc') {
    locale = 'zh-HK';
  } else if (locale == 'sc') {
    locale = 'zh-CN';
  }
  let callbackUrl = GetLocaleUrl(context.req.url ?? '/sabre-login', locale);
  if (callbackUrl.length > 1 && callbackUrl.endsWith('/')) {
    callbackUrl = callbackUrl.substring(0, callbackUrl.length - 1);
  }
  const session = await getServerSession(context.req, context.res, authOptions);
  setNextAuthCallbackUrl(callbackUrl, context.res);
  return { session };
};
