import { NextApiResponse } from 'next';
import NextAuth, { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import type { NextAuthOptions } from 'next-auth';
import AzureADB2CProvider, {
  AzureB2CProfile as NextAuthAzureB2CProfile,
} from 'next-auth/providers/azure-ad-b2c';
import { AzureB2CProfile, getB2CResponseMode, SsoApiPaths } from '@/utilities/SsoConstant';
import { getClientIp, ssoApiService } from '@/services/SsoApiService';
import { NextApiRequest } from 'next';
import { AuthorizationEndpointHandler, OAuthConfig, OAuthUserConfig } from 'next-auth/providers';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import { ServerResponse } from 'http';
import {
  GetLocaleUrl,
  SitecoreLanguageToAzureB2CLanguageMapping,
  URLLanguageToSitecoreLanguageMapping,
} from '@/utilities/LanguageUtilities';
import { createCache, memoryStore } from 'cache-manager';
import { profileCache } from '@/utilities/CacheUtilities';
import wellknown from '@/temp/wellknown';
import sign from 'jwt-encode';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import config from 'temp/config';
import * as cookieHelper from 'cookie';

export const getCookieValueName = (name: string, isSecure = false): string => {
  const secure = (isSecure || process.env.NEXTAUTH_URL?.includes('https')) ?? false;
  const prefix = secure ? '__Secure-' : '';
  return `${prefix}${name}`;
};

const localeCookieName = getCookieValueName('next-auth.locale');
// const scope = 'openid ' + AzureB2CProfile.AZURE_AD_B2C_CLIENT_ID;

export interface userProfile {
  Id?: string | null;
  Salutation?: string | null;
  FirstName?: string | null;
  LastName?: string | null;
  AADB2CId?: string | null;
  Email?: string | null;
  MobileCountry?: string | null;
  MobilePhoneNumber?: string | null;
  EmailOTPVerified?: boolean | null;
  PhoneOTPVerified?: boolean | null;
  Art?: boolean | null;
  Music?: boolean | null;
  Design?: boolean | null;
  Fashion?: boolean | null;
  Cars?: boolean | null;
  Watches?: boolean | null;
  Jewellery?: boolean | null;
  Sustainability?: boolean | null;
  DestinationTravel?: boolean | null;
  SportsAndFitness?: boolean | null;
  Beauty?: boolean | null;
  DiversityAndInclusion?: boolean | null;
  RestaurantsAndBars?: boolean | null;
  WechatId?: string | null;
  MarketingOptIn?: boolean | null;
  DataManageOutsideResidence?: boolean | null;
  DataManageWithinResidence?: boolean | null;
  RegisterSourceSystem?: string | null;
  CreatedDateTime?: string | null;
  LastModifiedDateTime?: string | null;
}

export type ExtendedUser = {
  access_token?: string | null;
  id_token?: string | null;
  profile?: userProfile | null;
};

export type ExtendedSession = Session & {
  user?: ExtendedUser | null;
};

export type ExtendedJWT = JWT & {
  access_token?: string | null;
  id_token?: string | null;
};

interface WellKnown {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  end_session_endpoint?: string;
  jwks_uri: string;
  jwks?: { keys: { [propName: string]: unknown }[] };
}

const getAzureB2CDomain = (tenant: string) => {
  let loginDomain = `${tenant}.b2clogin.com`;
  if (process.env.AZURE_AD_B2C_AUTH_DOMAIN) {
    loginDomain = process.env.AZURE_AD_B2C_AUTH_DOMAIN;
  }
  return loginDomain;
};

export const setGtmProfileToken = (profile: userProfile, res: NextApiResponse): void => {
  const data: Record<string, string | null> = {};
  if (profile) {
    const envProperties = process.env.NEXTAUTH_PROFILE_PROPERTIES!;
    if (envProperties && envProperties.length) {
      const properties = envProperties.split(',');
      for (let index = 0; index < properties.length; index++) {
        const property = properties[index].trim();
        data[property] = profile[property] ?? null;
      }
      const token = sign(data, process.env.NEXTAUTH_SECRET!);
      res.appendHeader(
        'set-cookie',
        getCookieVaule(getCookieValueName('next-auth.idtoken'), token, false, false)
      );
    }
  }
};

const getScope = (clientId: string) => {
  return ['openid', clientId].join(' ');
};

const getResponseType = () => {
  return ['code', 'id_token'].join(' ');
};

const getWellKnownUrl = (tenant: string, userFlow: string) => {
  return `https://${getAzureB2CDomain(tenant)}/${tenant}.onmicrosoft.com/${userFlow}/v2.0/.well-known/openid-configuration`;
};
const ttl = 3600 * 1000 * 24; //one day of cache period
const memoryMax = 9999;
const memoryCache = createCache(
  memoryStore({
    max: memoryMax,
    ttl: ttl /*milliseconds*/,
  })
);

const getKeys = async (jwks_uri: string) => {
  const cacheValue = await memoryCache.get(`jwks-${jwks_uri}`);
  if (cacheValue) {
    console.log(`Load from cached, url: ${jwks_uri}`);
    return cacheValue;
  } else {
    console.log(`Load from url: ${jwks_uri}`);
    const result = await fetch(jwks_uri);
    const data = await result.json();
    memoryCache.set(`jwks-${jwks_uri}`, data);
    return data;
  }
};

const getWellKnownJson = async (tenant: string, userFlow: string): Promise<WellKnown> => {
  const url = getWellKnownUrl(tenant, userFlow);
  const cacheValue = await memoryCache.get<WellKnown>(`wellKnown-${url}`);
  if (cacheValue) {
    console.log(`Load from cached, url: ${url}`);
    return cacheValue;
  } else {
    console.log(`Load from url: ${url}`);
    const result = await fetch(url);
    const data: WellKnown = await result.json();
    data.jwks = await getKeys(data.jwks_uri);
    memoryCache.set(`wellKnown-${url}`, data);
    return data;
  }
};

const getAzureADB2CProviderConfig = (
  id: string,
  primaryUserFlow: string | undefined,
  clientId: string,
  clientSecret: string,
  wellKnownData?: WellKnown,
  res?: NextApiResponse,
  locale?: string,
  req?: NextApiRequest,
  responseMode?: 'query' | 'form_post' | 'fragment'
): OAuthConfig<NextAuthAzureB2CProfile> => {
  const config: OAuthUserConfig<NextAuthAzureB2CProfile> & {
    primaryUserFlow?: string;
    tenantId?: string;
  } = {
    id: id,
    tenantId: AzureB2CProfile.AZURE_AD_B2C_TENANT_NAME,
    clientId: clientId,
    clientSecret: clientSecret,
    primaryUserFlow: primaryUserFlow,
    authorization: {
      params: {
        scope: getScope(clientId),
        response_type: getResponseType(),
        prompt: 'login',
        response_mode: responseMode ?? getB2CResponseMode(),
        ui_locales:
          locale && SitecoreLanguageToAzureB2CLanguageMapping[locale]
            ? SitecoreLanguageToAzureB2CLanguageMapping[locale]
            : undefined,
      },
    },
    checks: ['none'], //default is ['state'] if not specify, but accenture has no state
    async profile(profile, tokens) {
      if (profile.sub) {
        profileCache.del(profile.sub);
      }
      if (res) {
        if (tokens.access_token) {
          const ssoProfile = await GetLoginProfileDetail(
            profile.sub,
            tokens.access_token,
            req ? getClientIp(req) : undefined
          );
          if (ssoProfile) {
            const castProfile = ssoProfile as userProfile;
            setGtmProfileToken(castProfile, res);
            const method =
              primaryUserFlow === AzureB2CProfile.AZURE_AD_B2C_PHONE_USER_FLOW ? 'phone' : 'email';
            const trackingData = `${method}|success|${castProfile.Id}`;
            res.appendHeader(
              'set-cookie',
              getCookieVaule(getCookieValueName('triggersignin'), trackingData, false, false)
            );
          }
        }
      }
      return {
        id: profile.sub,
        name: profile.name ?? null,
        email: profile?.emails?.[0],
        image: null,
      };
    },
  };
  if (wellKnownData) {
    config.wellKnown = undefined;
    config.jwks_endpoint = wellKnownData.jwks_uri;
    config.token = wellKnownData.token_endpoint;
    config.issuer = wellKnownData.issuer;
    const authorization = config.authorization as AuthorizationEndpointHandler;
    if (authorization) {
      config.authorization = {
        ...authorization,
        url: wellKnownData.authorization_endpoint,
      };
    }
  } else {
    config.wellKnown = `https://${getAzureB2CDomain(AzureB2CProfile.AZURE_AD_B2C_TENANT_NAME)}/${AzureB2CProfile.AZURE_AD_B2C_TENANT_NAME}.onmicrosoft.com/${primaryUserFlow}/v2.0/.well-known/openid-configuration`;
  }

  return AzureADB2CProvider(config);
};

export const authOptions: NextAuthOptions = {
  providers: [],
  debug: process.env.NEXTAUTH_DEBUG ? true : false,
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async jwt({ token, account }) {
      if (account) {
        token.access_token = account.access_token;
        token.id_token = account.id_token;
      }
      return token;
    },
    async session({ session, token }: { session: ExtendedSession; token: ExtendedJWT }) {
      if (!session.user) {
        session.user = { access_token: '', id_token: '' }; // Initialize user
      }

      if (token.access_token) {
        session.user.access_token = token.access_token;
        session.user.id_token = token.id_token;
        if (!session.user.profile) {
          const profile = (await GetLoginProfileDetail(
            token.sub,
            token.access_token
          )) as userProfile;
          session.user.profile = profile;
        }
      }

      if (session?.user) {
        session.user.email = session.user.email ?? null;
      }

      return session;
    },
  },
  logger: {
    error(code, metadata) {
      console.error(code, metadata);
    },
    warn(code) {
      console.warn(code);
    },
  },
  session: { maxAge: 60 * 30 },
  pages: {
    error: SsoApiPaths.SIGN_IN_ERROR_PAGE,
  },
};

export async function GetLoginProfileDetail(
  sub: string | undefined,
  token: string,
  clientIp?: string
) {
  try {
    if (sub) {
      const cacheValue = await profileCache.get(sub);
      if (cacheValue) {
        console.log('Load from cache for ' + sub);
        return cacheValue;
      }
    }
    const response = await ssoApiService.getProfileV2(token, clientIp);
    if (!response.ErrorCode) {
      if (sub) {
        await profileCache.set(sub, response);
      }
      return response;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  return null;
}

// export default NextAuth(authOptions);
export const getClientSecret = (locale?: string) => {
  const lowerLocale = locale?.toLowerCase();
  let clientId = AzureB2CProfile.AZURE_AD_B2C_CLIENT_ID;
  let clientSecret = AzureB2CProfile.AZURE_AD_B2C_CLIENT_SECRET;
  if (lowerLocale) {
    if (['tc', 'zh-hk', 'zh-hant'].includes(lowerLocale)) {
      clientId = process.env.AZURE_AD_B2C_CLIENT_ID_TC ?? clientId;
      clientSecret = process.env.AZURE_AD_B2C_CLIENT_SECRET_TC ?? clientSecret;
    } else if (['sc', 'zh-cn', 'zh-hans'].includes(lowerLocale)) {
      clientId = process.env.AZURE_AD_B2C_CLIENT_ID_SC ?? clientId;
      clientSecret = process.env.AZURE_AD_B2C_CLIENT_SECRET_SC ?? clientSecret;
    }
  }
  return [clientId, clientSecret];
};

export const buildAzureB2CUrl = (locale: string, callbackUrl: string | undefined): string => {
  const [clientId] = getClientSecret(locale);
  const signinCallback = `${getPublicUrl()}/api/auth/callback/azureb2c`;
  return [
    `https://${getAzureB2CDomain(AzureB2CProfile.AZURE_AD_B2C_TENANT_NAME)}/${AzureB2CProfile.AZURE_AD_B2C_TENANT_NAME}.onmicrosoft.com/`,
    `${AzureB2CProfile.AZURE_AD_B2C_PRIMARY_USER_FLOW}/oauth2/v2.0/authorize`,
    `?client_id=${clientId}`,
    `&scope=${encodeURIComponent(getScope(clientId))}`,
    `&response_type=${encodeURIComponent(getResponseType())}`,
    `&redirect_uri=${encodeURIComponent(signinCallback)}`,
    '&prompt=login',
    `&ui_locales=${SitecoreLanguageToAzureB2CLanguageMapping[locale]}`,
    `&response_mode=${getB2CResponseMode()}`,
    callbackUrl ? `&callbackUrl=${encodeURIComponent(callbackUrl)}` : '',
  ].join('');
};

const getCookieVaule = (
  name: string,
  value: string,
  forceSecure = false,
  httpOnly = true
): string => {
  const secure = (forceSecure || process.env.NEXTAUTH_URL?.includes('https')) ?? false;
  const cookie = [`${name}=${encodeURIComponent(value)}`, 'Path=/'];
  if (httpOnly) {
    cookie.push('HttpOnly');
  }
  cookie.push('SameSite=Lax');
  if (secure) {
    cookie.push('Secure');
  }
  return cookie.join('; ');
};

const removeCookie = (name: string, res: ServerResponse) => {
  let domain: string | undefined = undefined;
  try {
    // Try to read config.publicUrl and parse host
    const publicUrl = config?.publicUrl;
    if (publicUrl) {
      let urlObj: URL | undefined = undefined;
      try {
        urlObj = new URL(publicUrl);
      } catch {
        // If missing protocol, add http:// as fallback
        urlObj = new URL('http://' + publicUrl);
      }
      if (urlObj?.hostname) {
        domain = urlObj.hostname;
      }
    }
  } catch {}

  ['lax', 'none', 'strict'].forEach((sameSite) => {
    const cookieOptions: cookieHelper.SetCookie = {
      name: name,
      value: '',
      secure: true,
      path: '/',
      sameSite: sameSite,
      expires: new Date(),
    };
    if (domain) {
      cookieOptions.domain = '.' + domain;
    }
    const setCookieHeader = cookieHelper.stringifySetCookie(cookieOptions);
    res.appendHeader('set-cookie', setCookieHeader);
  });
};

export const setNextAuthLocale = (locale: string, res: ServerResponse) => {
  res.appendHeader('set-cookie', getCookieVaule(localeCookieName, locale));
};

export const setNextAuthCallbackUrl = (url: string | undefined, res: ServerResponse) => {
  if (url) {
    res.appendHeader(
      'set-cookie',
      getCookieVaule(getCookieValueName('next-auth.callback-url'), url)
    );
  }
};

const getLocaleByClientId = (clientId: string) => {
  if (clientId == process.env.AZURE_AD_B2C_CLIENT_ID_TC) {
    return 'tc';
  } else if (clientId == process.env.AZURE_AD_B2C_CLIENT_ID_SC) {
    return 'sc';
  } else if (clientId == process.env.AZURE_AD_B2C_CLIENT_ID) {
    return 'en';
  }
  return undefined;
};

const decodeJwt = (idToken: string | string[] | undefined) => {
  try {
    if (idToken?.length) {
      const parts = idToken.toString().split('.');
      if (parts.length === 3) {
        const decoded = Buffer.from(parts[1], 'base64');
        return JSON.parse(decoded.toString());
      }
    }
  } catch {}
  return {};
};

const getLocaleByIdToken = (idToken: string | string[] | undefined) => {
  let clientId = '';
  const jwt = decodeJwt(idToken);
  if (jwt?.aud) {
    clientId = jwt?.aud;
  }
  return getLocaleByClientId(clientId);
};

const getSitecoreLangFromAzureB2CLanguage = (locale: string): string => {
  const scLang = Object.keys(SitecoreLanguageToAzureB2CLanguageMapping).find(
    (v) =>
      SitecoreLanguageToAzureB2CLanguageMapping[v] &&
      SitecoreLanguageToAzureB2CLanguageMapping[v] === locale
  );
  if (scLang) {
    locale = scLang;
  }
  return locale;
};

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const wellKnonwDatas: Record<string, WellKnown> = Object.assign({}, wellknown);
  /*
  try {
    if (process.env.AZURE_B2C_CACHE == 'true') {
      wellKnonwDatas['azureb2c'] = await getWellKnownJson(
        AzureB2CProfile.AZURE_AD_B2C_TENANT_NAME,
        AzureB2CProfile.AZURE_AD_B2C_PRIMARY_USER_FLOW
      );
      wellKnonwDatas['azureb2c-phone'] = await getWellKnownJson(
        AzureB2CProfile.AZURE_AD_B2C_TENANT_NAME,
        AzureB2CProfile.AZURE_AD_B2C_PHONE_USER_FLOW
      );
    }
  } catch (e) {}
   */

  const logger = winston.createLogger({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.splat(),
      winston.format.simple()
    ),
    transports: [
      new winston.transports.Console(),
      new DailyRotateFile({
        filename: 'logs/nextauth-%DATE%.log',
        datePattern: 'YYYYMMDD',
        zippedArchive: true,
        maxFiles: '30d',
      }),
    ],
  });

  let locale: string | undefined = undefined;
  if (req?.query?.nextauth?.includes('signin') && req.method === 'POST') {
    locale = req.body?.ui_locales?.toString()?.toLowerCase();
    if (locale) {
      locale = getSitecoreLangFromAzureB2CLanguage(locale);
    }
  } else if (req?.query?.nextauth?.includes('callback')) {
    // Override callback url
    const callbackUrlCookieName = getCookieValueName('next-auth.callback-url');
    const callbackUrlCookieValue = req.cookies[callbackUrlCookieName];
    const needDefault =
      !callbackUrlCookieValue || callbackUrlCookieValue === process.env.NEXTAUTH_URL;
    if (needDefault) {
      req.cookies[callbackUrlCookieName] = SsoApiPaths.SIGN_IN_CALLBACK;
    }
    const idToken = req.method === 'GET' ? req.query?.id_token : req.body?.id_token;
    if (idToken?.length) {
      locale = getLocaleByIdToken(idToken);
      const jwt = decodeJwt(idToken);

      if (locale && needDefault) {
        req.cookies[callbackUrlCookieName] = GetLocaleUrl(
          SsoApiPaths.SIGN_IN_CALLBACK,
          URLLanguageToSitecoreLanguageMapping[locale]
        );
      }

      const allowedDomains = [
        `${AzureB2CProfile.AZURE_AD_B2C_TENANT_NAME}.b2clogin.com`,
        getAzureB2CDomain(AzureB2CProfile.AZURE_AD_B2C_TENANT_NAME),
      ];
      if (jwt?.iss) {
        let providerName = req?.query?.nextauth?.includes('azureb2c-phone')
          ? 'azureb2c-phone'
          : 'azureb2c';
        if (req?.query?.nextauth?.includes('azureb2c-pwd')) {
          providerName = 'azureb2c-pwd';
        }

        // Handle pasword flow
        let flow = jwt?.acr;
        if (flow && flow.toLowerCase() === process.env.AZURE_AD_B2C_PWD_USER_FLOW?.toLowerCase()) {
          const flow = `azureb2c-${jwt.acr.toLowerCase()}`;
          if (wellKnonwDatas[flow]) {
            logger.info(`Override wellKnonwData for ${providerName} to ${flow}`);
            wellKnonwDatas[providerName] = wellKnonwDatas[flow];
          }
          if (wellKnonwDatas[`default-${flow}`]) {
            wellKnonwDatas[`default-${providerName}`] = wellKnonwDatas[`default-${flow}`];
          }
        }

        const iss = jwt.iss.toString();
        if (wellKnonwDatas[providerName] && wellKnonwDatas[providerName].issuer != iss) {
          const allowed = allowedDomains.some((n) => iss.includes(n));
          if (allowed) {
            if (
              wellKnonwDatas[`default-${providerName}`] &&
              wellKnonwDatas[`default-${providerName}`].issuer == iss
            ) {
              logger.info(`Override issuer from ${wellKnonwDatas[providerName].issuer} to ${iss}`);
              wellKnonwDatas[providerName] = wellKnonwDatas[`default-${providerName}`];
            }
          }
        }
      }
    }
    if (locale) {
      const lowerLocale = locale.toLocaleLowerCase();
      locale = URLLanguageToSitecoreLanguageMapping[lowerLocale] ?? locale;
      let callbackUrl = req.cookies[callbackUrlCookieName];
      if (locale && callbackUrl) {
        console.log(`old callbackUrl = ${callbackUrl}, locale = ${locale}`);
        callbackUrl = callbackUrl.replace(getPublicUrl(), '');
        const supportedLanguage = Object.keys(URLLanguageToSitecoreLanguageMapping);
        const supportedLanguageRegex = new RegExp(`^\/(${supportedLanguage.join('|')})\/`, 'i');
        callbackUrl = callbackUrl.replace(supportedLanguageRegex, '/');
        req.cookies[callbackUrlCookieName] = GetLocaleUrl(callbackUrl, locale);
        console.log(`updated callbackUrl = ${req.cookies[callbackUrlCookieName]}`);
      }
    }
  } else if (req?.query?.nextauth?.includes('signout')) {
    res.appendHeader(
      'set-cookie',
      getCookieVaule(getCookieValueName('next-auth.idtoken'), '', false, false) +
        `; Expires=${new Date().toUTCString()}`
    );
    if (process.env.NEXT_PUBLIC_PERSONALIZE_CLEAR_ON_SIGNOUT === 'true') {
      removeCookie(`sc_${config.sitecoreEdgeContextId}`, res);
      removeCookie(`sc_${config.sitecoreEdgeContextId}_personalize`, res);
    }
  } else if (req?.query?.nextauth?.includes('signin') && req.method === 'GET') {
    if (req?.query?.error) {
      return res.redirect(307, SsoApiPaths.SIGN_IN_ERROR_PAGE);
    }
    return res.redirect(307, SsoApiPaths.SIGN_IN_PAGE);
  }

  logger.info(`[next-auth][${req.method}]: ${req.url}`);
  authOptions.logger = {
    error(code, metadata) {
      logger.error(
        `[next-auth][error][${code}]\nhttps://next-auth.js.org/errors#${code.toLowerCase()}`,
        metadata.message,
        metadata
      );
    },
    warn(code) {
      logger.warn(
        `[next-auth][warn][${code}]\nhttps://next-auth.js.org/warnings#${code.toLowerCase()}`
      );
    },
    debug(code, metadata) {
      logger.info(`[next-auth][debug][${code}]`, metadata);
    },
  };

  if (locale) {
    authOptions.pages = {
      ...(authOptions.pages || {}),
      error: GetLocaleUrl(
        SsoApiPaths.SIGN_IN_ERROR_PAGE,
        URLLanguageToSitecoreLanguageMapping[locale]
      ),
    };
  }

  locale = locale ?? 'en';
  const [clientId, clientSecret] = getClientSecret(locale);
  const azureConfigs: Record<string, string> = {
    azureb2c: AzureB2CProfile.AZURE_AD_B2C_PRIMARY_USER_FLOW,
    'azureb2c-phone': AzureB2CProfile.AZURE_AD_B2C_PHONE_USER_FLOW,
  };
  authOptions.providers = Object.keys(azureConfigs).map((v) =>
    getAzureADB2CProviderConfig(
      v,
      azureConfigs[v],
      clientId,
      clientSecret,
      wellKnonwDatas[v],
      res,
      locale,
      req
    )
  );

  // Handle auto login
  if (
    process.env.AZURE_AD_B2C_AUTOLOGIN_CLIENT_ID &&
    process.env.AZURE_AD_B2C_AUTOLOGIN_USER_FLOW
  ) {
    authOptions.providers.push(
      getAzureADB2CProviderConfig(
        'azureb2c-pwd',
        process.env.AZURE_AD_B2C_AUTOLOGIN_USER_FLOW,
        process.env.AZURE_AD_B2C_AUTOLOGIN_CLIENT_ID,
        clientSecret,
        wellKnonwDatas['azureb2c-pwd'],
        res,
        locale,
        req,
        'query'
      )
    );
  }

  logger.info(`authOptions`, authOptions);

  return await NextAuth(req, res, authOptions);
}
