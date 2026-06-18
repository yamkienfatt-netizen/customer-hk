import { NextRequest } from 'next/server';
import { lookup, LookupResult } from 'ip-location-api/pack';
import { debug } from '@sitecore-jss/sitecore-jss-nextjs/middleware';

const CITY_HEADER_NAME = 'ali-ip-city';
const COUNTRY_HEADER_NAME = 'ali-ip-country';
const REGION_HEADER_NAME = 'ali-ip-region';
const XFF_HEADER_NAME = 'x-forwarded-for';
const XREALIP_HEADER_NAME = 'ali-real-client-ip';

export interface Geolocation {
  city?: string;
  country?: string;
  region?: string;
}

export const getHeader = (headers: Headers, key: string) => {
  return headers.get(key) ?? void 0;
};

export const geolocation = async (req: NextRequest): Promise<Geolocation> => {
  const isContentDelivery = process.env.NEXT_PUBLIC_ROLE_CONTENT_DELIVERY === 'true';
  const headers = req.headers;
  const geo: Geolocation = {
    city: getHeader(headers, CITY_HEADER_NAME),
    country: getHeader(headers, COUNTRY_HEADER_NAME),
    region: getHeader(headers, REGION_HEADER_NAME),
  };
  if (isContentDelivery && !geo.city) {
    // Try X-Forwarded-For first, then ali-real-client-ip
    const ip =
      headers.get(XFF_HEADER_NAME)?.split(',')[0] ||
      headers.get(XREALIP_HEADER_NAME) ||
      (req as any).ip ||
      '127.0.0.1';

    // If city is not available in headers, attempt to look up geolocation based on IP
    if (ip) {
      const lookupResult = await lookupGeolocation(ip);
      geo.city = lookupResult?.city;
      geo.country = lookupResult?.country;
      geo.region = lookupResult?.region;
    }
  }
  return geo;
};

async function lookupGeolocation(ip: string): Promise<Geolocation> {
  // console.log(`Looking up geolocation for IP: ${ip}`);
  // Implement your geolocation lookup logic here, e.g., call an external API
  // For demonstration purposes, we'll return dummy data
  const location = lookup(ip) as LookupResult;
  debug.personalize(`Geolocation lookup for IP: ${ip}, Result:`, location);
  return {
    city: location?.city,
    country: location?.country,
    region: location?.region1,
  };
}
