import type { NextApiRequest, NextApiResponse } from 'next';
import {
  NativeDataFetcher,
  GraphQLSitemapXmlService,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { siteResolver } from 'lib/site-resolver';
import config from 'temp/config';
import clientFactory from 'lib/graphql-client-factory';

const locRegex = new RegExp(`<loc>(${config.publicUrl})(/.{0,1024})</loc>`, 'gi');
const languageCodeRegex = new RegExp('^/(en|tc|sc|zh-hk|zh-cn|ja-jp|es-es|pt-pt)/', 'i');

const sitemapApi = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<NextApiResponse | void> => {
  const {
    query: { id },
  } = req;

  // Resolve site based on hostname
  const hostName = req.headers['host']?.split(':')[0] || 'localhost';
  const site = siteResolver.getByHost(hostName);
  console.log(`sitemap request for host: ${hostName}, resolved site: ${site?.name}`);

  // create sitemap graphql service
  const sitemapXmlService = new GraphQLSitemapXmlService({
    clientFactory,
    siteName: site.name,
  });

  // The id is present if url has sitemap-{n}.xml type.
  // The id can be null if it's index sitemap.xml request
  const sitemapPath = await sitemapXmlService.getSitemap(id as string);

  // regular sitemap
  if (sitemapPath) {
    console.log(`sitemapPath: ${sitemapPath}`);
    try {
      const fetcher = new NativeDataFetcher();
      const xmlResponse = await fetcher.fetch<string>(sitemapPath);

      if (!xmlResponse?.data) {
        console.log('fetcher returns empty');
        return res.redirect('/404');
      }

      res.setHeader('Content-Type', 'text/xml;charset=utf-8');

      let sitemapContent = xmlResponse.data;
      sitemapContent = replaceDomain(sitemapContent);
      sitemapContent = replaceXDefaultLocale(sitemapContent);
      sitemapContent = replaceLocEnLocale(sitemapContent);
      sitemapContent = replaceHreflangLocale(sitemapContent);
      sitemapContent = replaceChineseLocale(sitemapContent);
      sitemapContent = normalizePageUrl(sitemapContent);

      return res.send(sitemapContent);
    } catch (error) {
      console.log('Error fetching sitemap xml', error);
      return res.redirect('/404');
    }
  }

  // index /sitemap.xml that includes links to all sitemaps
  const sitemaps = await sitemapXmlService.fetchSitemaps();

  if (!sitemaps.length) {
    console.log('sitemapXmlService returns empty');
    return res.redirect('/404');
  }

  const reqHost = req.headers.host;
  const reqProtocol = req.headers['x-forwarded-proto'] || 'https';
  const SitemapLinks = sitemaps
    .map((item: string) => {
      const parseUrl = item.split('/');
      const lastSegment = parseUrl[parseUrl.length - 1];
      const escapedUrl = `${reqProtocol}://${reqHost}/${lastSegment}`.replace(/&/g, '&amp;');

      return `<sitemap>
        <loc>${escapedUrl}</loc>
      </sitemap>`;
    })
    .join('');

  res.setHeader('Content-Type', 'text/xml;charset=utf-8');

  return res.send(`<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://sitemaps.org/schemas/sitemap/0.9">${SitemapLinks}</sitemapindex>
  `);
};

function normalizePageUrl(sitemapContent: string) {
  const content = sitemapContent.replace(/(<loc>[^<]+|href="[^"]+)/g, (match: string) => {
    let url = match.toLocaleLowerCase();
    if (process.env.NEXT_PUBLIC_ROLE_CONTENT_DELIVERY === 'true' && !url.endsWith('/')) {
      url += '/';
    }
    return url;
  });
  return content;
}

function replaceLocEnLocale(sitemapContent: string) {
  return sitemapContent.replace(locRegex, (m, p1, p2) => {
    if (p2 && !languageCodeRegex.test(p2)) {
      return `<loc>${p1}/en${p2}</loc>`;
    }
    return m;
  });
}

function replaceHreflangLocale(sitemapContent: string) {
  return sitemapContent
    .replace(/hreflang="zh-HK"/g, 'hreflang="zh-Hant"')
    .replace(/hreflang="zh-CN"/g, 'hreflang="zh-Hans"');
}

function replaceXDefaultLocale(sitemapContent: string) {
  return sitemapContent.replace(/x-default/g, 'en');
}

function replaceChineseLocale(sitemapContent: string) {
  return sitemapContent.replace(/zh-HK/g, 'tc').replace(/zh-CN/g, 'sc');
}

function replaceDomain(sitemapContent: string) {
  const scHostRegex = new RegExp(`${process.env.SITEMAP_HOST}`, 'g');
  return sitemapContent.replace(scHostRegex, config.publicUrl);
}

export default sitemapApi;
