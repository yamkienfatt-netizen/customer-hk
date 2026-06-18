import Head from 'next/head';
import {
  GraphQLErrorPagesService,
  SitecoreContext,
  ErrorPages,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { SitecorePageProps } from 'lib/page-props';
import Layout from 'src/Layout';
import { componentBuilder } from 'temp/componentBuilder';
import { GetStaticProps } from 'next';
import config from 'temp/config';
import { siteResolver } from 'lib/site-resolver';
import clientFactory from 'lib/graphql-client-factory';
import { GetHeadlessSiteSettingsService } from '@/graphql/HeadlessSiteSettingsQuery.service';
import { HeadlessSiteSettingsGraphQLProps } from '@/props/Graphql/HeadlessSiteSettingsGraphQLProps';
import { URLLanguageToSitecoreLanguageMapping } from '@/utilities/LanguageUtilities';
import { JSX } from 'react';
import { fetchComponentProps } from 'lib/component-props';

/**
 * Rendered in case if we have 500 error
 */
const ServerError = (): JSX.Element => (
  <>
    <Head>
      <title>500: Server Error</title>
    </Head>
    <div style={{ padding: 10 }}>
      <h1>500 Internal Server Error</h1>
      <p>There is a problem with the resource you are looking for, and it cannot be displayed.</p>
      <a href="/">Go to the Home page</a>
    </div>
  </>
);

const Custom500 = (props: SitecorePageProps): JSX.Element => {
  if (!(props && props.layoutData)) {
    return <ServerError />;
  }

  return (
    <SitecoreContext
      componentFactory={componentBuilder.getComponentFactory()}
      layoutData={props.layoutData}
      api={{
        edge: {
          contextId: config.sitecoreEdgeContextId,
          edgeUrl: config.sitecoreEdgeUrl,
        },
      }}
    >
      <Layout
        layoutData={props.layoutData}
        headLinks={props.headLinks}
        gtmid={props.gtmid}
        cookieConsentContent={props.cookieConsentContent}
        cookieConsentVisible={props.cookieConsentVisible}
        cookieConsentButton={props.cookieConsentButton}
        cookieConsentExpireDays={props.cookieConsentExpireDays}
      />
    </SitecoreContext>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const site = siteResolver.getByName(config.sitecoreSiteName);
  const language = context.locale || context.defaultLocale || config.defaultLanguage;
  const errorPagesService = new GraphQLErrorPagesService({
    clientFactory,
    siteName: site.name,
    language: URLLanguageToSitecoreLanguageMapping[language] ?? language,
    retries:
      (process.env.GRAPH_QL_SERVICE_RETRIES &&
        parseInt(process.env.GRAPH_QL_SERVICE_RETRIES, 10)) ||
      0,
  });
  let resultErrorPages: ErrorPages | null = null;
  let headlessSiteSettings: HeadlessSiteSettingsGraphQLProps | null = null;

  if (!process.env.DISABLE_SSG_FETCH) {
    try {
      resultErrorPages = await errorPagesService.fetchErrorPages();
      headlessSiteSettings = await GetHeadlessSiteSettingsService(
        '{6772036A-C368-4D13-B0C6-A86F124A5B8A}',
        URLLanguageToSitecoreLanguageMapping[language] ?? language
      );
    } catch (error) {
      console.log('Error occurred while fetching error pages');
      console.log(error);
    }
  }

  const layoutData = resultErrorPages?.notFoundPage?.rendered || null;

  let componentProps = {};

  if (layoutData?.sitecore?.route) {
    componentProps = await fetchComponentProps(layoutData, context);
  }

  return {
    props: {
      headLinks: [],
      layoutData,
      componentProps,
      gtmid: headlessSiteSettings?.item?.gtmid?.value || null,
      cookieConsentContent:
        headlessSiteSettings?.item?.cookieConsentContent?.jsonValue.value || null,
      cookieConsentVisible:
        headlessSiteSettings?.item?.cookieConsentVisible?.jsonValue.value ?? false,
      cookieConsentButton: headlessSiteSettings?.item?.cookieConsentButton?.jsonValue.value || null,
      // layoutData: resultErrorPages?.serverErrorPage?.rendered || null,
    },
  };
};

export default Custom500;
