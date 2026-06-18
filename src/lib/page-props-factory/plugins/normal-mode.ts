import { GetServerSidePropsContext, GetStaticPropsContext } from 'next';
import { DictionaryService, LayoutService } from '@sitecore-jss/sitecore-jss-nextjs';
import { dictionaryServiceFactory } from 'lib/dictionary-service-factory';
import { layoutServiceFactory } from 'lib/layout-service-factory';
import { SitecorePageProps } from 'lib/page-props';
import { pathExtractor } from 'lib/extract-path';
import { Plugin, isServerSidePropsContext } from '..';

import { caching } from 'cache-manager';
import { GetHeadlessSiteSettingsService } from '@/graphql/HeadlessSiteSettingsQuery.service';
const ttl = 3600 * 1000; //one hour of cache period
const memoryMax = 9999;

class NormalModePlugin implements Plugin {
  private dictionaryServices: Map<string, DictionaryService>;
  private layoutServices: Map<string, LayoutService>;
  private memoryCache: any;
  order = 1;

  constructor() {
    this.dictionaryServices = new Map<string, DictionaryService>();
    this.layoutServices = new Map<string, LayoutService>();
  }

  async exec(props: SitecorePageProps, context: GetServerSidePropsContext | GetStaticPropsContext) {
    if (!this.memoryCache) {
      console.log(`Init memory cache `);
      this.memoryCache = await caching('memory', {
        max: memoryMax,
        ttl: ttl,
      });
    } else {
      console.log(`Memory cache init-ed`);
    }

    if (context.preview) return props;

    // Get normalized Sitecore item path
    const path = pathExtractor.extract(context.params);
    //context.locale : [ 'en', 'sc', 'tc', 'es', 'pt' ],

    // Custom mapping of language
    if (context.locale == 'sc') {
      props.locale = 'zh-CN';
    } else if (context.locale == 'tc') {
      props.locale = 'zh-HK';
    } else if (context.locale == 'default') {
      props.locale = 'en';
    } else {
      props.locale = context.locale!;
    }

    // Use context locale if Next.js i18n is configured, otherwise use default site language
    props.locale = props.locale ?? props.site.language;

    // Fetch layout data, passing on req/res for SSR
    const layoutService = this.getLayoutService(props.site.name);

    props.layoutData = await layoutService.fetchLayoutData(
      path,
      props.locale,
      // eslint-disable-next-line prettier/prettier
      isServerSidePropsContext(context) ? (context as GetServerSidePropsContext).req : undefined,
      isServerSidePropsContext(context) ? (context as GetServerSidePropsContext).res : undefined
    );

    // Fetch dictionary data
    const cacheKey = `dictionary-${props.locale}`;
    let scDictionary = await this.memoryCache.get(cacheKey);
    if (!scDictionary) {
      console.log(`Sitecore dictionary not found. Fetching from Sitecore`);
      const dictionaryService = this.getDictionaryService(props.site.name);
      scDictionary = await dictionaryService.fetchDictionaryData(props.locale);
      await this.memoryCache.set(cacheKey, scDictionary, ttl);
    } else {
      console.log(`Sitecore dictionary from memory cache`);
    }
    props.dictionary = scDictionary;

    if (!props.layoutData?.sitecore.route) {
      // A missing route value signifies an invalid path, so set notFound.
      // Our page routes will return this in getStatic/ServerSideProps,
      // which will trigger our custom 404 page with proper 404 status code.
      // You could perform additional logging here to track these if desired.
      props.notFound = true;
    }

    // Initialize links to be inserted on the page
    props.headLinks = [];

    const headlessSiteSettingsCacheKey = `headless-site-settings-${props.locale}`;
    let headlessSiteSettings = await this.memoryCache.get(headlessSiteSettingsCacheKey);
    if (!headlessSiteSettings) {
      console.log(`Sitecore headless site settings not found. Fetching from Sitecore`);
      headlessSiteSettings = await GetHeadlessSiteSettingsService(
        '{6772036A-C368-4D13-B0C6-A86F124A5B8A}',
        props.locale
      );
      await this.memoryCache.set(headlessSiteSettingsCacheKey, headlessSiteSettings, ttl);
    } else {
      console.log(`Sitecore headless site settings from memory cache`);
    }
    props.gtmid = headlessSiteSettings.item?.gtmid?.value;
    props.cookieConsentContent = headlessSiteSettings.item?.cookieConsentContent?.jsonValue.value;
    props.cookieConsentVisible = headlessSiteSettings.item?.cookieConsentVisible?.jsonValue.value;
    props.cookieConsentButton = headlessSiteSettings.item?.cookieConsentButton?.jsonValue.value;
    props.cookieConsentExpireDays =
      headlessSiteSettings.item?.cookieConsentExpireDays?.jsonValue.value ?? 7;

    return props;
  }

  private getDictionaryService(siteName: string): DictionaryService {
    if (this.dictionaryServices.has(siteName)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.dictionaryServices.get(siteName)!;
    }

    const dictionaryService = dictionaryServiceFactory.create(siteName);
    this.dictionaryServices.set(siteName, dictionaryService);

    return dictionaryService;
  }

  private getLayoutService(siteName: string): LayoutService {
    if (this.layoutServices.has(siteName)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.layoutServices.get(siteName)!;
    }

    const layoutService = layoutServiceFactory.create(siteName);
    this.layoutServices.set(siteName, layoutService);

    return layoutService;
  }
}

export const normalModePlugin = new NormalModePlugin();
