import type { NextApiRequest, NextApiResponse } from 'next';
import { GraphQLRobotsService } from '@sitecore-jss/sitecore-jss-nextjs';
import { siteResolver } from 'lib/site-resolver';
import clientFactory from 'lib/graphql-client-factory';
import config from 'temp/config';

const robotsApi = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  res.setHeader('Content-Type', 'text/plain');

  // Resolve site based on hostname
  const hostName = req.headers['host']?.split(':')[0] || 'localhost';
  const site = siteResolver.getByHost(hostName);

  // create robots graphql service
  const robotsService = new GraphQLRobotsService({
    clientFactory,
    siteName: site.name,
  });

  let robotsResult = await robotsService.fetchRobots();
  const scHostRegex = new RegExp(`${process.env.SITEMAP_HOST}`, 'g');
  robotsResult = robotsResult.replace(scHostRegex, config.publicUrl);

  // console.log(`robotsResult `, robotsResult);
  // robotsResult = robotsResult.replace(
  //   'Sitemap: https://xmc-swirehotels1-swirehotels-production.sitecorecloud.io/sitemap.xml',
  //   ''
  // );
  // robotsResult = robotsResult.replace(
  //   'Sitemap: https://xmc-swirehotels1-swirehotels-uat.sitecorecloud.io/sitemap.xml',
  //   ''
  // );
  // robotsResult = robotsResult.replace(
  //   'Sitemap: https://xmc-swirehotels1-swirehotels-sit.sitecorecloud.io/sitemap.xml',
  //   ''
  // );

  return res.status(200).send(robotsResult);
};

export default robotsApi;
