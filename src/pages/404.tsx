import config from 'temp/config';
import {
  GraphQLErrorPagesService,
  SitecoreContext,
  ErrorPages,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { SitecorePageProps } from 'lib/page-props';
import NotFound from 'src/NotFound';
import { componentBuilder } from 'temp/componentBuilder';
import Layout from 'src/Layout';
import { GetServerSideProps, GetStaticProps } from 'next';
import { siteResolver } from 'lib/site-resolver';
import { dictionaryServiceFactory } from 'lib/dictionary-service-factory';
import { I18nProvider, useI18n } from 'next-localization';
import { useEffect } from 'react';
import { GetLocaleUrl, URLLanguageToSitecoreLanguageMapping } from '@/utilities/LanguageUtilities';
import ComponentError from 'components/easthotels/Error/ComponentError';
import clientFactory from 'lib/graphql-client-factory';
import { JSX } from 'react';

const Custom404 = (props: SitecorePageProps): JSX.Element => {
  try {
    const { locale } = useI18n();
    if (!(props && props.layoutData && props.layoutData?.sitecore?.context?.itemPath)) {
      console.log(`404 redirecting to <NotFound />`);
      return <NotFound />;
    }

    useEffect(() => {
      window.location.href = GetLocaleUrl(
        props.layoutData?.sitecore?.context.itemPath as string,
        locale()
      );
    }, []);

    return <></>;
  } catch (err) {
    return <ComponentError error={err} />;
  }

  // return (
  //   <I18nProvider lngDict={props.dictionary} locale={props.locale}>
  //     <SitecoreContext
  //       componentFactory={componentBuilder.getComponentFactory()}
  //       layoutData={props.layoutData}
  //     >

  //       <Layout layoutData={props.layoutData} headLinks={props.headLinks} />
  //     </SitecoreContext>
  //   </I18nProvider>
  // );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const site = siteResolver.getByName(config.sitecoreSiteName);
  const language = context.locale || config.defaultLanguage;
  console.log(`404 site language ${language}`);

  const errorPagesService = new GraphQLErrorPagesService({
    clientFactory,
    siteName: site.name,
    language: context.locale || config.defaultLanguage,
    retries:
      (process.env.GRAPH_QL_SERVICE_RETRIES &&
        parseInt(process.env.GRAPH_QL_SERVICE_RETRIES, 10)) ||
      0,
  });
  let resultErrorPages: ErrorPages | null = null;

  if (!process.env.DISABLE_SSG_FETCH) {
    try {
      resultErrorPages = await errorPagesService.fetchErrorPages();
    } catch (error) {
      console.log('Error occurred while fetching error pages');
      console.log(error);
    }
  }

  return {
    props: {
      headLinks: [],
      layoutData: resultErrorPages?.notFoundPage?.rendered || null,
    },
  };
};

// This function gets called at request time on server-side.
// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const site = siteResolver.getByName(config.jssAppName);
//   const language = context.locale || config.defaultLanguage;
//   console.log(`404 site language ${language}`);

//   const errorPagesService = new GraphQLErrorPagesService({
//     endpoint: config.graphQLEndpoint,
//     apiKey: config.sitecoreApiKey,
//     siteName: site.name,
//     language: language,
//   });
//   let resultErrorPages: ErrorPages | null = null;

//   try {
//     resultErrorPages = await errorPagesService.fetchErrorPages();
//   } catch (error) {
//     console.log('Error occurred while fetching error pages');
//     console.log(error);
//   }
//   return {
//     props: {
//       headLinks: [],
//       layoutData: resultErrorPages?.notFoundPage?.rendered || null,
//     },
//   };
// };

export default Custom404;
