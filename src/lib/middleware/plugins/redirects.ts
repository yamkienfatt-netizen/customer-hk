import { NextRequest, NextResponse } from 'next/server';
import { RedirectsMiddleware } from '@sitecore-jss/sitecore-jss-nextjs/middleware';
import config from 'temp/config';
import { MiddlewarePlugin } from '..';
import { siteResolver } from 'lib/site-resolver';
import clientFactory from 'lib/graphql-client-factory';
import { UrlRedirections } from '@/utilities/UrlRedirections';
import Papa from 'papaparse';
import { caching } from 'cache-manager';
import { MemoryCacheClient, CacheOptions, CacheClient } from '../../cache-client';

const ttl = 3600 * 1000; //one hour of cache period
const memoryMax = 9999;

class RedirectsPlugin implements MiddlewarePlugin {
  private redirectsMiddleware: RedirectsMiddleware;
  order = 0;
  private memoryCache: any;
  private cache: CacheClient<any>;

  constructor() {
    this.cache = this.getCacheClient();
    this.redirectsMiddleware = new RedirectsMiddleware({
      clientFactory,
      // These are all the locales you support in your application.
      // These should match those in your next.config.js (i18n.locales).
      locales: ['en'],
      // This function determines if a route should be excluded from RedirectsMiddleware.
      // Certain paths are ignored by default (e.g. Next.js API routes), but you may wish to exclude more.
      // This is an important performance consideration since Next.js Edge middleware runs on every request.
      excludeRoute: () => false,
      // This function determines if the middleware should be turned off.
      // By default it is disabled while in development mode.
      //disabled: () => process.env.NODE_ENV === 'development',
      disabled: () => true,
      // Site resolver implementation
      siteResolver,
    });
  }

  /**
   * exec async method - to find coincidence in url.pathname and redirects of site
   * @param req<NextRequest>
   * @returns Promise<NextResponse>
   */
  async exec(req: NextRequest, res?: NextResponse): Promise<NextResponse> {
    if (process.env.FRONTEND_MIDDLEWARE_ENABLED) {
      const excludedExtension = ['svg', 'ttf', 'js', 'jpg', 'jpeg', 'png', 'ico'];
      const fileExtension = this.getFileTypeFromURL(req.nextUrl.pathname);

      // For request to access to public folder
      if (excludedExtension.includes(fileExtension)) {
        return this.redirectsMiddleware.getHandler()(req, res);
      }

      if (req.nextUrl.locale === 'default') {
        if (fileExtension) {
          console.log(`Request with file extension ${fileExtension} will be skipped for redirection.`);
          return this.redirectsMiddleware.getHandler()(req, res);
        }
        console.log(`redirection locale ${req.nextUrl.locale} path ${req.nextUrl.pathname} `);

        let locale = 'en';

        if (req.nextUrl.pathname.startsWith('/hongkong')) {
          locale = 'en';
        } else if (req.nextUrl.pathname.startsWith('/beijing')) {
          locale = 'sc';
        } else if (req.nextUrl.pathname.startsWith('/miami')) {
          locale = 'en';
        }

        return NextResponse.redirect(
          new URL(`/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
        );
      } else {
        var redirection = await this.getRedirection(req.nextUrl.locale, req.nextUrl.pathname);
        if (redirection) {
          console.log(`Middleware redirection found. Redirecting now.`);
          return NextResponse.redirect(new URL(redirection.To, req.url), Number(redirection.Code));
        }
      }
    }

    //Fallback if none of the above hits
    return this.redirectsMiddleware.getHandler()(req, res);
  }

  protected getCacheClient(): CacheClient<any> {
    return new MemoryCacheClient<any>({
      cacheEnabled: true,
      cacheTimeout: 3600,
    });
  }

  getFileTypeFromURL(url: string) {
    const regex = /(?:\.([^.]+))?$/; // Regular expression to capture file extension
    const extension = regex.exec(url)[1]; // Extract extension from URL
    return extension ? extension.toLowerCase() : '';
  }

  async getRedirection(locale: string, url: string) {
    const fullUrl = `/${locale}${url}`;

    let redirectionCsv = process.env.REDIRECTION_BRAND_CSV;
    if (url.toLowerCase().startsWith('/hongkong')) {
      redirectionCsv = process.env.REDIRECTION_HONGKONG_CSV;
    } else if (url.toLowerCase().startsWith('/beijing')) {
      redirectionCsv = process.env.REDIRECTION_BEIJING_CSV;
    } else if (url.toLowerCase().startsWith('/miami')) {
      redirectionCsv = process.env.REDIRECTION_MIAMI_CSV;
    }

    const cacheKey = redirectionCsv!;
    let data = this.cache.getCacheValue(cacheKey);

    if (!data) {
      console.log(`Getting redirection for ${fullUrl} from ${redirectionCsv}`);
      const redirectionCsvResp = await fetch(`${redirectionCsv}`);

      if (redirectionCsvResp.status.toString() != '200') {
        return null;
      }
      let redirectCsv = await redirectionCsvResp.text();

      if (!redirectCsv) {
        console.log(`Redirection csv not found, return null`);
        return null;
      }

      data = Papa.parse(redirectCsv, { header: true });
      this.cache.setCacheValue(cacheKey, data);
    }else{
      console.log(`Redirection cache available. Return from cache`);
    }

    let redirectionElement = null;

    for (var i = 0; i < data.data.length; i++) {
      if (data.data[i].From.toLowerCase() == fullUrl.toLowerCase()) {
        redirectionElement = data.data[i];
        break;
      }
    }

    console.log(
      `Getting redirection for ${fullUrl} from ${redirectionCsv} and will be redirected to ${redirectionElement?.To}`
    );
    return redirectionElement;
  }
}

export const redirectsPlugin = new RedirectsPlugin();
