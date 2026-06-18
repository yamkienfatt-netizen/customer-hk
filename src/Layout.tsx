/**
 * This Layout is needed for Starter Kit.
 */
import React, { useEffect, JSX } from 'react';
import Head from 'next/head';
import {
  Placeholder,
  LayoutServiceData,
  Field,
  HTMLLink,
  DesignLibrary,
  RenderingType,
} from '@sitecore-jss/sitecore-jss-nextjs';
import config from 'temp/config';
import Scripts from 'src/Scripts';
import { AnimatePresence } from 'framer-motion';
import { _SeoMetadata } from './props/common/_SeoMetadata';
import { _PageMetadata } from './props/common/_PageMetadata';
import { useRouter } from 'next/router';
import { GoogleTagManager, sendGTMEvent } from '@next/third-parties/google';
import { MiamiMetadata } from 'components/easthotels/Metadata/miami-metadata';
import CookieBanner from 'components/easthotels/Consent/CookieBanner';
import Script from 'next/script';
import { useDispatch, useSelector } from 'react-redux';
import { setAliyunCaptchaLoadedState } from 'lib/redux/features/scriptLoadStatus';
import Cookies from 'js-cookie';
import { getCookieValueName } from './pages/api/auth/[...nextauth]';
import localFont from 'next/font/local';

// Prefix public assets with a public URL to enable compatibility with Sitecore Experience Editor.
// If you're not supporting the Experience Editor, you can remove this.
const publicUrl = config.publicUrl;

interface LayoutProps {
  layoutData: LayoutServiceData;
  headLinks: HTMLLink[];
  gtmid: string;
  cookieConsentContent: string;
  cookieConsentVisible: boolean;
  cookieConsentButton: string;
  cookieConsentExpireDays: number;
}

interface RouteFields extends _SeoMetadata {
  [key: string]: unknown;
  Title?: Field;
  Description?: Field;
}

const amiko = localFont({
  src: [
    {
      weight: '400',
      path: '../public/fonts/Amiko/Amiko-Regular.ttf',
    },
    {
      weight: '600',
      path: '../public/fonts/Amiko/Amiko-SemiBold.ttf',
    },
    {
      weight: '700',
      path: '../public/fonts/Amiko/Amiko-Bold.ttf',
    },
  ],
  variable: '--font-amiko',
  adjustFontFallback: false,
  fallback: ['Microsoft JhengHei', 'sans-serif'],
});

const bellefair = localFont({
  src: [
    {
      weight: '400',
      path: '../public/fonts/Bellefair/Bellefair-Regular.ttf',
    },
  ],
  variable: '--font-bellefair',
  adjustFontFallback: false,
  fallback: ['Microsoft JhengHei', 'sans-serif'],
});

const Layout = ({
  layoutData,
  headLinks,
  gtmid,
  cookieConsentContent,
  cookieConsentVisible,
  cookieConsentButton,
  cookieConsentExpireDays,
}: LayoutProps): JSX.Element => {
  const { route } = layoutData?.sitecore;
  const fields = route?.fields as RouteFields & _PageMetadata;
  const isPageEditing = layoutData?.sitecore?.context.pageEditing;
  const mainClassPageEditing = isPageEditing ? 'editing-mode' : 'prod-mode';

  const renderContent = () => (
    <div className={isPropertyPage ? 'bg-property' : 'bg-brand'}>
      <AnimatePresence>
        {route && <Placeholder name="headless-header" rendering={route} />}

        {route && <Placeholder name="headless-main" rendering={route} />}
        <CookieBanner
          cookieConsentContent={cookieConsentContent}
          cookieConsentVisible={cookieConsentVisible}
          cookieConsentButton={cookieConsentButton}
          cookieConsentExpireDays={cookieConsentExpireDays}
        />

        {route && <Placeholder name="headless-footer" rendering={route} />}
      </AnimatePresence>
    </div>
  );

  const isPropertyPage = fields.IsPropertyPage?.value?.toString() == 'true';
  const router = useRouter();

  const currentUrl = fields.CanonicalUrl?.value.href
    ? fields.CanonicalUrl?.value.href
    : `${publicUrl}/${router.locale}${router.asPath}`;

  const dispatch = useDispatch();
  useEffect(() => {
    try {
      const name = getCookieValueName('triggersignin');
      const triggersignin = Cookies.get(name);
      if (triggersignin) {
        const [method, status, member_id] = triggersignin.split('|');
        sendGTMEvent({
          event: 'login_signup_status',
          login_or_signup: 'login',
          status,
          method,
          member_id,
          intent: 'successful login',
        });
        Cookies.remove(name, { secure: name.startsWith('__Secure') });
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <>
      <Scripts />
      {/* <Script src='https://o.alicdn.com/captcha-frontend/aliyunCaptcha/AliyunCaptcha.js' onLoad={() => dispatch(setAliyunCaptchaLoadedState(true))}/> */}
      <Head>
        <title>{fields?.PageTitle?.value?.toString()}</title>
        <meta name="description" content={fields?.MetaDescription?.value?.toString()}></meta>
        <meta name="keywords" content={fields?.MetaKeywords?.value?.toString()}></meta>
        <meta
          property="og:image"
          content={`${process.env.XMCLOUD_MEDIA_LIBRARY_HOST}/Project/EAST-Hotels/east-logo-og.jpg`}
        />
        <meta property="og:title" content={fields?.PageTitle?.value?.toString()} />
        <meta property="og:description" content={fields?.MetaDescription?.value?.toString()} />
        <meta property="og:url" content={currentUrl} />
        {/* <meta property="og:image:width" content="124" /> */}
        <meta property="og:image:width" content="1200" />
        {/* <meta property="og:image:height" content="45" /> */}
        <meta property="og:image:height" content="630" />

        {/* <link
          rel="preload"
          href="/fonts/Amiko/Amiko-Regular.ttf"
          as="font"
          type="font/ttf"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/Amiko/Amiko-Bold.ttf"
          as="font"
          type="font/ttf"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/Amiko/Amiko-SemiBold.ttf"
          as="font"
          type="font/ttf"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/Bellefair/Bellefair-Regular.ttf"
          as="font"
          type="font/ttf"
          crossOrigin=""
        /> */}

        <link rel="icon" href={`${publicUrl}/favicon2.ico`} />
        {headLinks.map((headLink) => (
          <link rel={headLink.rel} key={headLink.href} href={headLink.href} />
        ))}
        {/* <script
          type="text/javascript"
          src="https://o.alicdn.com/captcha-frontend/aliyunCaptcha/AliyunCaptcha.js"
        ></script> */}
        {/* <script src="https://a.amap.com/jsapi_demos/static/demo-center/js/demoutils.js"></script> */}
        {/* <link
          rel="stylesheet"
          href="https://g.alicdn.com/apsara-media-box/imp-web-player/2.16.3/skins/default/aliplayer-min.css"
        /> */}
        {/* <script
          defer
          // charset="utf-8"
          type="text/javascript"
          src="https://g.alicdn.com/apsara-media-box/imp-web-player/2.16.3/aliplayer-h5-min.js"
        ></script> */}
        <link rel="canonical" href={currentUrl}></link>
      </Head>
      <Script id="aliyun-captcha-config">
        {`window.AliyunCaptchaConfig = ${JSON.stringify({
          region: 'cn',
          prefix: process.env.CAPTCHA_PREFIX_ID,
        })};`}
      </Script>

      <h1 className="hidden">{fields?.Title?.value?.toString()}</h1>
      <h2 className="hidden">{fields?.MetaDescription?.value?.toString()}</h2>

      {/* root placeholder for the app, which we add components to using route data */}
      <div className={`${mainClassPageEditing} ${amiko.variable} ${bellefair.variable}`}>
        {layoutData.sitecore.context.renderingType === RenderingType.Component ? (
          <DesignLibrary {...layoutData} />
        ) : (
          renderContent()
        )}
      </div>
    </>
  );
};

export default Layout;
