import React, { useState } from 'react';
import {
  Text as ScText,
  RichText as ScRichText,
  Image as ScImage,
  withDatasourceCheck,
  Placeholder,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { SitecoreLink } from '../CustomTypes/Components/SitecoreLink';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import Typography from '../Typography/Typography';
import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import { HtmlLink } from '../CustomTypes/Components/HtmlLink';
import { NavigationLinkProp } from '@/props/Navigation/NavigationProps';
import { SiteConfigurationProp } from '@/props/SiteConfigurationProp';
import ComponentError from '../Error/ComponentError';
import { GetLocaleUrl } from '@/utilities/LanguageUtilities';
import { QrCodeDialog } from '../CustomTypes/Components/QrCodeDialog';
import Image from 'next/image';
import Link from 'next/link';
import CTAButton from '../Button/CTAButton';

// import CTAButton from '../PageContent/CTAButton';

const publicUrl = getPublicUrl();

const FooterLink = (siteConfigurationProp: SiteConfigurationProp) => {
  try {
    const { t, locale } = useI18n();

    const footerLinks = siteConfigurationProp.fields.FooterLinks?.fields.SelectedLinks;
    const linkItems = footerLinks?.map((link: NavigationLinkProp, index: any) => (
      // <SitecoreLink key={index} field={link.fields.URL}>
      <Link
        href={link.fields?.URL?.value?.href || ''}
        onClick={(e) => {
          e.preventDefault();
          window.location.href = GetLocaleUrl(link.fields?.URL?.value?.href || '', locale());
        }}
      >
        <Typography
          variant="l1"
          fontWeight="bold"
          extraStyles="hover:decoration-2 hover:underline underline-offset-4"
        >
          <ScText field={link.fields.Title} />
        </Typography>
      </Link>
    ));

    return (
      <div className="grid w-[100%] grid-cols-2 gap-x-[68px] gap-y-[10px] lg:flex lg:grid-cols-none lg:flex-wrap lg:gap-x-[30px] lg:gap-y-0">
        {linkItems}
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
      <div className={`flex grid-cols-${propertyLinks.length} divide-x divide-black`}>
        {propertyLinks &&
          propertyLinks.map((property: NavigationLinkProp, index: any) => (
            <div
              key={index}
              className={`${index === 0 ? 'pr-[15px]' : 'px-[15px]'} ${
                index === propertyLinks!.length - 1 ? 'pl-[15px]' : ''
              }`}
            >
              {/* <SitecoreLink field={property.fields.URL}> */}
              <Link
                href={property.fields?.URL?.value?.href || ''}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = GetLocaleUrl(
                    property.fields?.URL?.value?.href || '',
                    locale()
                  );
                }}
              >
                <Typography
                  variant="l1"
                  fontWeight="bold"
                  extraStyles="hover:decoration-2 hover:underline underline-offset-4 mb-0"
                >
                  <ScText field={property.fields.Title} />
                </Typography>
              </Link>
            </div>
          ))}
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
      <div>
        <Typography variant={'l1'} fontWeight="bold" extraStyles="mb-[10px]">
          {t(DICTIONARY_CONSTANT.FOOTER.STAYCONNECTEDTITLE)}
        </Typography>
        <form className="w-full" onSubmit={onSubmit}>
          <div className="flex items-center border-b border-black-secondary  py-2">
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
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

const ShareButtons = (siteConfigurationProp: SiteConfigurationProp) => {
  const { t, locale } = useI18n();
  const onClick = (e: any, href: string) => {
    e.preventDefault();
    window.location.href = GetLocaleUrl(href, locale());
  };

  return (
    <div className="flex">
      {/* <SitecoreLink field={siteConfigurationProp.fields.FacebookLink}> */}
      <Link
        href={siteConfigurationProp?.fields?.FacebookLink?.value?.href || ''}
        onClick={(e) => {
          onClick(e, siteConfigurationProp?.fields?.FacebookLink?.value?.href || '');
        }}
      >
        <ScImage
          field={siteConfigurationProp.fields.FacebookIcon}
          className="mr-5 h-auto w-[25px] object-fill"
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
          className="mr-5 h-auto w-[25px] object-cover"
        />
      </QrCodeDialog>
    </div>
  );
};

const LicenseAndCopyright = (siteConfigurationProp: SiteConfigurationProp) => {
  try {
    const { t, locale } = useI18n();

    return (
      <div className="lg:text-end">
        <Typography variant={'l2'} extraStyles="mb-[10px]">
          <ScRichText field={siteConfigurationProp.fields.ICPContent} />
        </Typography>
        <Typography variant={'l2'}>{t(DICTIONARY_CONSTANT.FOOTER.COPYRIGHT)}</Typography>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

const Footer = (siteConfigurationProp: SiteConfigurationProp) => {
  try {
    return (
      <footer className="bg-white px-[15px] py-[30px] lg:p-[30px]">
        {/* mobile footer */}
        <div className="herobanner-section-container flex flex-col lg:hidden">
          <div className="mt-[20px] flex flex-col [&>*:nth-child(2)]:mt-[20px] [&>*:nth-child(n+3)]:mt-[30px]">
            {/* <HtmlLink href="/">
              <img src={siteConfigurationProp.fields?.Icon.value?.src} />
            </HtmlLink> */}
            <hr />
            <div className="flex">
              <FooterLink {...siteConfigurationProp} />
            </div>
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
            <div>
              <FooterCities {...siteConfigurationProp} />
            </div>
            <ShareButtons {...siteConfigurationProp} />
          </div>
          <div className="mt-[20px]">
            <LicenseAndCopyright {...siteConfigurationProp} />
          </div>
        </div>
        {/* desktop footer */}
        <div className="herobanner-section-container hidden lg:block">
          <div className="flex items-center justify-between">
            <div className="flex flex-col ">
              {/* <HtmlLink href="/">
                <img src={siteConfigurationProp.fields?.Icon.value?.src} />
              </HtmlLink> */}
              <div className="">
                <FooterLink {...siteConfigurationProp} />
              </div>
            </div>
            <div className="flex flex-col justify-end">
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
            </div>
          </div>
          <hr className="my-[30px]" />
          <div className="flex justify-between ">
            <div>
              <FooterCities {...siteConfigurationProp} />
              <div className="mt-[20px]">
                <ShareButtons {...siteConfigurationProp} />
              </div>
            </div>
            <div className="flex flex-col">
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

export default withDatasourceCheck()<SiteConfigurationProp>(Footer);
