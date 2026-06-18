import { useEffect, JSX } from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import {
  authOptions,
  buildAzureB2CUrl,
  getClientSecret,
  setNextAuthCallbackUrl,
  setNextAuthLocale,
} from './api/auth/[...nextauth]';
import NotFound from 'src/NotFound';
import Layout from 'src/Layout';
import { SitecoreContext, ComponentPropsContext } from '@sitecore-jss/sitecore-jss-nextjs';
import { handleEditorFastRefresh } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import { SitecorePageProps } from 'lib/page-props';
import { sitecorePagePropsFactory } from 'lib/page-props-factory';
import { componentBuilder } from 'temp/componentBuilder';
import { AzureB2CProfile, SsoApiPaths } from '@/utilities/SsoConstant';
import {
  GetLocaleUrl,
  SitecoreLanguageToAzureB2CLanguageMapping,
} from '@/utilities/LanguageUtilities';
import config from 'temp/config';

const SitecorePage = ({
  notFound,
  componentProps,
  layoutData,
  headLinks,
  gtmid,
  cookieConsentContent,
  cookieConsentVisible,
  cookieConsentButton,
  cookieConsentExpireDays,
}: SitecorePageProps): JSX.Element => {
  useEffect(() => {
    // Since Sitecore editors do not support Fast Refresh, need to refresh editor chromes after Fast Refresh finished
    handleEditorFastRefresh();
  }, []);

  if (notFound || !layoutData?.sitecore.route) {
    // Shouldn't hit this (as long as 'notFound' is being returned below), but just to be safe
    console.log(`general path return <NotFound />`);
    // return <NotFound />;
  }

  const isEditing = layoutData.sitecore.context.pageEditing;

  return (
    <>
      {layoutData && layoutData?.sitecore && layoutData?.sitecore?.route && (
        <ComponentPropsContext value={componentProps}>
          <SitecoreContext
            componentFactory={componentBuilder.getComponentFactory({ isEditing })}
            layoutData={layoutData}
            api={{
              edge: {
                contextId: config.sitecoreEdgeContextId,
                edgeUrl: config.sitecoreEdgeUrl,
              },
            }}
          >
            <Layout
              layoutData={layoutData}
              headLinks={headLinks}
              gtmid={gtmid}
              cookieConsentContent={cookieConsentContent}
              cookieConsentVisible={cookieConsentVisible}
              cookieConsentButton={cookieConsentButton}
              cookieConsentExpireDays={cookieConsentExpireDays}
            />
          </SitecoreContext>
        </ComponentPropsContext>
      )}

      {notFound || !layoutData?.sitecore.route ? <NotFound /> : null}
    </>
  );
};

// This function gets called at request time on server-side.
export const getServerSideProps: GetServerSideProps = async (context) => {
  const props = await sitecorePagePropsFactory.create(context);

  if (props.layoutData?.sitecore?.route) {
    const currentPageNeedsAuthentication =
      props.layoutData?.sitecore?.route?.fields?.NeedAuthentication?.value ?? false;

    // Get the user session
    const session = await getServerSession(context.req, context.res, authOptions);
    const needsAuthentication = currentPageNeedsAuthentication && !session;

    const callbackUrl = GetLocaleUrl(context.req.url ?? '/', props.locale);
    const b2cUrl = buildAzureB2CUrl(
      props.locale,
      GetLocaleUrl(context.req.url ?? '/', props.locale)
    );

    if (needsAuthentication) {
      setNextAuthCallbackUrl(callbackUrl, context.res);
      setNextAuthLocale(props.locale, context.res);
      return {
        props,
        redirect: {
          //destination: `/${props.locale}/login`,
          destination: b2cUrl,
          permanent: false,
        },
      };
    }

    if (
      context.req.url === '/login' ||
      context.req.url === '/login/' ||
      context.req.url == '/member' ||
      context.req.url == '/member/'
    ) {
      if (session) {
        return {
          props,
          redirect: {
            destination: GetLocaleUrl(SsoApiPaths.SIGN_IN_CALLBACK, props.locale),
            permanent: false,
          },
        };
      } else {
        setNextAuthCallbackUrl(callbackUrl, context.res);
        setNextAuthLocale(props.locale, context.res);
        return {
          props,
          redirect: {
            //destination: `/${props.locale}/login`,
            destination: b2cUrl,
            permanent: false,
          },
        };
      }
    }

    if (session && context.req.url?.startsWith('/registration')) {
      return {
        props,
        redirect: {
          destination: GetLocaleUrl(SsoApiPaths.SIGN_IN_CALLBACK, props.locale),
          permanent: false,
        },
      };
    }
  }
  // if (context.req.url && /^\/member\/.*$/.test(context.req.url)) {
  //   context.res.setHeader('Cache-Control', 'no-cache');
  // }
  if (process.env.NEXT_PAGE_CACHE_CONTROL === 'true') {
    if (context.query.cache?.toString() != '0') {
      context.res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
    } else {
      context.res.setHeader('Cache-Control', 'no-cache');
      console.log(`Disable cache for ${context.req.url!}`);
    }
  }

  return {
    props,
    notFound: props.notFound, // Returns custom 404 page with a status code of 404 when true
  };
};

export default SitecorePage;
