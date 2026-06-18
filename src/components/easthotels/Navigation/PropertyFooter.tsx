import React, { useEffect, useRef, useState } from 'react';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import { HtmlLink } from '../CustomTypes/Components/HtmlLink';
import {
  Text as ScText,
  Image as ScImage,
  withDatasourceCheck,
  Placeholder,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { SitecoreLink } from '../CustomTypes/Components/SitecoreLink';
import { useI18n } from 'next-localization';
import Typography from '../Typography/Typography';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';

import { SiteConfigurationProp } from '@/props/SiteConfigurationProp';
import { NavigationLinkProp, NavigationLinksProp } from '@/props/Navigation/NavigationProps';
import ComponentError from '../Error/ComponentError';
import { GetLocaleUrl } from '@/utilities/LanguageUtilities';
import { QrCodeDialog } from '../CustomTypes/Components/QrCodeDialog';
import Image from 'next/image';
import Link from 'next/link';
import CTAButton from '../Button/CTAButton';

const publicUrl = getPublicUrl();

const SiteMap = ({ footerSitemap }: { footerSitemap: NavigationLinksProp }) => {
  try {
    const { t, locale } = useI18n();

    return (
      <div className={'grid grid-cols-2 gap-y-8 lg:grid-cols-3 lg:gap-x-20 lg:gap-y-10'}>
        {footerSitemap.fields.SelectedLinks.map(
          (cat: NavigationLinksProp | NavigationLinkProp, index: number) => (
            <div key={`${index}-${cat.fields.Title}`} className="min-w-[150px]">
              {
                // Check if URL exists in the field. Yes indicates is a link, else is a group
                'URL' in cat.fields ? (
                  <>
                    {/* <SitecoreLink field={(cat as NavigationLinkProp).fields.URL}> */}
                    <Link
                      href={(cat as NavigationLinkProp).fields?.URL?.value?.href || ''}
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = GetLocaleUrl(
                          (cat as NavigationLinkProp).fields?.URL?.value?.href || '',
                          locale()
                        );
                      }}
                    >
                      <Typography variant="l1" extraStyles="mb-[9px]" fontWeight="bold">
                        <ScText field={(cat as NavigationLinkProp).fields.Title} />
                      </Typography>
                    </Link>
                  </>
                ) : (
                  <>
                    <Typography variant="l1" extraStyles="mb-[9px]" fontWeight="bold">
                      <ScText field={cat.fields.Title} />
                    </Typography>
                  </>
                )
              }

              {/* 2nd level NavigationLinksProp */}
              <>
                {cat.fields.SelectedLinks &&
                  cat.fields.SelectedLinks.map((link: NavigationLinkProp, index: number) => {
                    //Safe checking to make sure 2nd level navigation is link not links
                    return (
                      'URL' in link.fields && (
                        // <SitecoreLink field={link.fields.URL} key={index}>
                        <Link
                          key={`${index}-${link.fields.Title}`}
                          href={link.fields?.URL?.value?.href || ''}
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = GetLocaleUrl(
                              link.fields?.URL?.value?.href || '' || '',
                              locale()
                            );
                          }}
                        >
                          <Typography variant="l1" extraStyles="mb-[3px]">
                            <ScText field={link.fields.Title} />
                          </Typography>
                        </Link>
                      )
                    );
                  })}
              </>
            </div>
          )
        )}
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

const FooterDesktopSiteMap = (siteConfigurationProp: SiteConfigurationProp) => {
  try {
    return (
      <div className="flex flex-col">
        <SiteMap footerSitemap={siteConfigurationProp.fields.FooterSitemap} />
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

const FooterMobileSiteMap = (siteConfigurationProp: SiteConfigurationProp) => {
  try {
    const [isSiteMapOpen, setIsSiteMapOpen] = useState(false);
    const { t, locale } = useI18n();
    return (
      <div>
        <div
          className="hover:cursor-pointer"
          onClick={() => {
            setIsSiteMapOpen(!isSiteMapOpen);
          }}
        >
          <div className="flex flex-row">
            <Typography variant="l1" extraStyles="mb-[20px]" fontWeight="bold">
              {t(DICTIONARY_CONSTANT.FOOTER.MOBILE_SITEMAP)}
            </Typography>
            <Image
              src={
                isSiteMapOpen
                  ? `${publicUrl}/icon_chevron_up.svg`
                  : `${publicUrl}/icon_chevron_down.svg`
              }
              alt="left_arrow"
              className="ml-1.5 h-3.5 w-3.5"
              width={14}
              height={14}
            />
          </div>
        </div>

        <div
          className={`${
            isSiteMapOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden transition-all duration-500 ease-in-out`}
        >
          <div className="mb-10">
            <SiteMap footerSitemap={siteConfigurationProp.fields.FooterSitemap} />
          </div>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

const FooterLink = (siteConfigurationProp: SiteConfigurationProp) => {
  try {
    const { t, locale } = useI18n();

    const footerLinks = siteConfigurationProp.fields.FooterLinks?.fields.SelectedLinks;
    const linkItems = footerLinks?.map((link: NavigationLinkProp, index: any) => (
      <Link
        href={link?.fields?.URL?.value?.href || ''}
        onClick={(e) => {
          e.preventDefault();
          window.location.href = GetLocaleUrl(link.fields?.URL?.value?.href || '', locale());
        }}
      >
        {/* <SitecoreLink key={index} field={link.fields.URL}> */}
        {/* <Typography variant="l1" extraStyles="mr-[65px] lg:mr-0" fontWeight="bold"> */}
        <Typography variant="l1" extraStyles="lg:mr-0" fontWeight="bold">
          <ScText field={link.fields.Title} />
        </Typography>
      </Link>
    ));

    return (
      // <div className="grid grid-cols-2 gap-x-[30px] gap-y-[10px] lg:flex lg:grid-cols-none lg:flex-wrap lg:gap-y-0">
      <div className="grid grid-cols-2 gap-y-[10px] lg:flex lg:grid-cols-none lg:flex-wrap lg:gap-x-[30px] lg:gap-y-0">
        {linkItems}
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

const StayConnectedForm = (siteConfigurationProp: SiteConfigurationProp) => {
  try {
    const { t, locale } = useI18n();

    const [subscriptionEmail, setSubscriptionEmail] = useState('');

    function redirectToSubscriptionForm() {
      var subscriptionFormUrl = siteConfigurationProp.fields.SubscriptionForm.value.href;
      window.location.href = GetLocaleUrl(
        `${subscriptionFormUrl!}?email=${subscriptionEmail}`,
        locale()
      );
    }

    function onSubmit(event: any) {
      event.preventDefault();
      redirectToSubscriptionForm();
    }

    return (
      <>
        <div>
          <Typography variant={'l1'} fontWeight="bold">
            {t(DICTIONARY_CONSTANT.FOOTER.STAYCONNECTEDTITLE)}
          </Typography>
          <form onSubmit={onSubmit}>
            <div className="flex items-center border-b border-[#1D2021] py-2">
              <input
                className="focus:shadow-outline w-full border-none font-[Amiko] text-[12px] focus:outline-none lg:w-[364px]"
                id="email"
                type="text"
                placeholder={t(DICTIONARY_CONSTANT.FOOTER.STAYCONNECTEDPLACEHOLDER)}
                onChange={(event) => setSubscriptionEmail(event.target.value)}
              ></input>
              <button type="button" onClick={redirectToSubscriptionForm}>
                <Image src={`${publicUrl}/icon_arrow.svg`} alt="enter" width={26} height={26} />
              </button>
            </div>
          </form>
        </div>
      </>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

const MediaIcons = (siteConfigurationProp: SiteConfigurationProp) => {
  try {
    const { t, locale } = useI18n();

    const onClick = (e: any, href: string) => {
      e.preventDefault();
      window.location.href = GetLocaleUrl(href, locale());
    };

    return (
      <div className="mt-[35px] flex flex-row items-center lg:justify-end">
        {/* <SitecoreLink field={siteConfigurationProp.fields.FacebookLink}> */}
        <Link
          href={siteConfigurationProp?.fields?.FacebookLink?.value?.href || ''}
          onClick={(e) => {
            onClick(e, siteConfigurationProp?.fields?.FacebookLink?.value?.href || '');
          }}
        >
          <ScImage
            field={siteConfigurationProp.fields.FacebookIcon}
            className="mr-5 h-auto w-[25px] object-cover"
          />
        </Link>

        {/* <SitecoreLink field={siteConfigurationProp.fields.InstagramLink}> */}
        <Link
          href={siteConfigurationProp.fields?.InstagramLink?.value?.href || ''}
          onClick={(e) => {
            onClick(e, siteConfigurationProp.fields?.InstagramLink?.value?.href || '');
          }}
        >
          <ScImage
            field={siteConfigurationProp.fields.InstagramIcon}
            className="mr-5 h-auto w-[25px] object-cover"
          />
        </Link>

        <QrCodeDialog
          qrCodeImg={siteConfigurationProp.fields.WechatQRCode}
          desc={siteConfigurationProp.fields.WechatQRCodeText}
          descIc={siteConfigurationProp.fields.WechatIconBlack}
        >
          <ScImage
            field={siteConfigurationProp.fields.WechatIcon}
            className="mr-5 mt-[-2px] h-[30px] w-[25px] object-cover"
          />
        </QrCodeDialog>

        {/* <SitecoreLink field={siteConfigurationProp.fields.TripAdvisorLink}> */}
        <Link
          href={siteConfigurationProp.fields.TripAdvisorLink?.value?.href || ''}
          onClick={(e) => {
            onClick(e, siteConfigurationProp.fields.TripAdvisorLink?.value?.href || '');
          }}
        >
          <ScImage
            field={siteConfigurationProp.fields.TripAdvisorIcon}
            className="mr-5 mt-[-2px] h-[15px] w-[25px] object-cover"
          />
        </Link>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

const FooterCities = (siteConfigurationProp: SiteConfigurationProp) => {
  try {
    const { t, locale } = useI18n();

    const propertyLinks = siteConfigurationProp.fields.PropertyLinks?.fields.SelectedLinks;
    return (
      <div
        className={`flex grid-cols-${propertyLinks.length} mt-[30px] lg:mt-[25px] lg:justify-end`}
      >
        {propertyLinks &&
          propertyLinks.map((property: NavigationLinkProp, index: any) => (
            <div className="flex items-center" key={index}>
              <div
                className={`${index === 0 ? 'pr-[15px]' : 'px-[15px]'} ${
                  index === propertyLinks!.length - 1 ? 'pl-[15px]' : ''
                }`}
              >
                {/* <SitecoreLink field={property.fields.URL} key={index}> */}
                <Link
                  href={property.fields.URL?.value?.href || ''}
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = GetLocaleUrl(
                      property.fields.URL?.value?.href || '',
                      locale()
                    );
                  }}
                >
                  <Typography
                    variant="l1"
                    extraStyles="hover:decoration-2 hover:underline underline-offset-4"
                    fontWeight="bold"
                  >
                    <ScText field={property.fields.Title} />
                  </Typography>
                </Link>
              </div>
              {index < propertyLinks.length - 1 && (
                <div className="h-[11px] w-[2px] bg-black-secondary" />
              )}
            </div>
          ))}
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

const LicenseAndCopyright = (siteConfigurationProp: SiteConfigurationProp) => {
  try {
    const { t, locale } = useI18n();

    return <Typography variant={'l1'}>{t(DICTIONARY_CONSTANT.FOOTER.COPYRIGHT)}</Typography>;
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

const PropertyFooter = (siteConfigurationProp: SiteConfigurationProp) => {
  try {
    const { t, locale } = useI18n();
    const footerRef = useRef<HTMLDivElement>(null);
    const footerMobileRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (!footerRef.current) return;
      if (!footerMobileRef.current) return;
      console.log('InUseEffect For Checking');
      console.log(footerRef.current.firstChild);
      console.log('InUseEffect For Checking End');
      const FE = footerRef.current.firstChild as HTMLDivElement;
      FE.style.marginTop = '0px';

      const FEMobile = footerMobileRef.current.firstChild as HTMLDivElement;
      FEMobile.style.marginTop = '0px';
    }, []);
    return (
      <footer className=" relative z-20 bg-white px-[15px] py-[30px] lg:p-[30px]">
        {/* mobile footer */}
        <div className="herobanner-section-container flex flex-col lg:hidden">
          <div className="flex flex-col">
            {/* <SitecoreLink field={siteConfigurationProp.fields.HomeLink.fields.URL}> */}
            <Link
              href={siteConfigurationProp.fields?.HomeLink?.fields?.URL?.value?.href || ''}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = GetLocaleUrl(
                  siteConfigurationProp.fields?.HomeLink?.fields?.URL?.value?.href || '',
                  locale()
                );
              }}
            >
              <ScImage
                field={siteConfigurationProp.fields.FooterIcon}
                className="h-[45px] w-[185px]"
              />
            </Link>

            <hr className="my-[30px]" />
            <div>
              <FooterMobileSiteMap {...siteConfigurationProp} />
              <FooterLink {...siteConfigurationProp} />
            </div>
          </div>

          <div ref={footerMobileRef} className="mt-[40px] flex flex-col">
            {/* <StayConnectedForm {...siteConfigurationProp} /> */}
            {!!siteConfigurationProp.fields?.URL?.value?.href && (
              <CTAButton
                  variant="contained-big"
                  url={siteConfigurationProp.fields?.URL}
                  text={siteConfigurationProp.fields?.Text}
                  bgColor="green-primary"
                  fontColor="white"
                ></CTAButton>
            )}
            <FooterCities {...siteConfigurationProp} />
            {/* TODO: Wen please convert media icons for user to add social media link from sitecore */}
            <MediaIcons {...siteConfigurationProp} />
            {/* <hr className="my-[30px]" /> */}
            <div className="mt-5 lg:mt-0">
              <LicenseAndCopyright {...siteConfigurationProp} />
            </div>
          </div>
        </div>

        {/* desktop footer */}
        <div className="herobanner-section-container hidden lg:block">
          <div className="flex justify-between">
            <div className="flex w-full flex-row items-end justify-between">
              <SitecoreLink field={siteConfigurationProp.fields.HomeLink.fields.URL}>
                <ScImage
                  field={siteConfigurationProp.fields.FooterIcon}
                  className="h-[45px] w-[185px]"
                />
              </SitecoreLink>

              <FooterLink {...siteConfigurationProp} />
            </div>
          </div>

          <hr className="bg-text-black-secondary my-[30px] border-t-2" />

          <div className="flex flex-row justify-between">
            <FooterDesktopSiteMap {...siteConfigurationProp} />
            <div className=" flex flex-col justify-between">
              <div ref={footerRef} className=" lg:justify-items-end">
                {/* <div className="flex flex-col items-end pt-[25px]">
                  <StayConnectedForm {...siteConfigurationProp} />
                </div> */}
                {!!siteConfigurationProp.fields?.URL?.value?.href && (
                  <CTAButton
                  variant="contained-big"
                  url={siteConfigurationProp.fields?.URL}
                  text={siteConfigurationProp.fields?.Text}
                  bgColor="green-primary"
                  fontColor="white"
                ></CTAButton>
                )}
                <MediaIcons {...siteConfigurationProp} />
                <FooterCities {...siteConfigurationProp} />
              </div>
              <LicenseAndCopyright {...siteConfigurationProp} />
            </div>
          </div>
        </div>
      </footer>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default withDatasourceCheck()<SiteConfigurationProp>(PropertyFooter);
