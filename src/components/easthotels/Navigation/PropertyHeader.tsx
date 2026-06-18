import React, { useEffect, useState, JSX } from 'react';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import {
  Image as ScImage,
  Text as ScText,
  useSitecoreContext,
  withDatasourceCheck,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { SitecoreLink } from '../CustomTypes/Components/SitecoreLink';
import Typography from '../Typography/Typography';
import { HtmlLink } from '../CustomTypes/Components/HtmlLink';

import useWindowSize from 'src/hooks/useWindowSize';
import DropDown from '../CustomTypes/Components/DropDown';
import {
  PropertyEastResidenceSiteConfigurationProp,
  PropertySiteConfigurationProp,
} from '@/props/SiteConfigurationProp';
import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import BookNow from 'components/easthotels/StayAtEast/BookNow';
import { motion } from 'framer-motion';
import HeaderMenu from 'components/easthotels/Navigation/HeaderMenu';
import { PageRouteFields } from '@/props/Core/PageProps';
import { _PageMetadata } from '@/props/common/_PageMetadata';
import {
  GetLocaleUrl,
  SitecoreLanguageToAzureB2CLanguageMapping,
  SitecoreLanguageToURLMapping,
} from '@/utilities/LanguageUtilities';
import { usePathname } from 'next/navigation';
import { string } from 'zod';
import ComponentError from '../Error/ComponentError';
import Image from 'next/image';
import { SsoApiPaths } from '@/utilities/SsoConstant';
import { sendGTMEvent } from '@next/third-parties/google';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { setIsLoadingState, setUserLoggedInState } from 'lib/redux/features/userLoginStatus';
import { SiteApiPaths } from '@/utilities/LinkUtilities';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'lib/redux/store';

const publicUrl = getPublicUrl();

const LanguageDropdown = ({
  propertySiteConfigurationProps,
}: {
  propertySiteConfigurationProps:
    | PropertySiteConfigurationProp
    | PropertyEastResidenceSiteConfigurationProp;
}) => {
  try {
    const pathname = usePathname();
    const { t, locale } = useI18n();
    const currentLocale = locale();
    const currentUrlLanguage = SitecoreLanguageToURLMapping[
      currentLocale as keyof typeof string
    ] as string;

    const dropdownItems =
      propertySiteConfigurationProps.fields?.SiteLanguages?.fields?.SupportedLanguages?.map(
        (languageLink) => {
          let newLanguageLink = JSON.parse(JSON.stringify(languageLink));
          newLanguageLink.fields.LanguageText.value = String(
            newLanguageLink.fields.LanguageText?.value?.toUpperCase() || ''
          );

          return {
            href: languageLink.fields?.LanguageSetting?.fields?.Iso,
            text: newLanguageLink.fields?.LanguageText,
          };
        }
      );

    const currentDropdownItem = dropdownItems.find(
      (element) => element.href.value == currentUrlLanguage
    );
    const [selectedLang, setSelectedLang] = useState(currentDropdownItem?.text.value);

    //Todo: Based on the current language, display different value
    return (
      <DropDown
        dropdownItems={dropdownItems}
        minWidth="85px"
        onItemSelected={(name) => {
          setSelectedLang(name);

          const selectedDropdown = dropdownItems.find((element) => element.text.value == name);
          if (pathname == '/') {
            window.location.href = `${pathname}${selectedDropdown?.href.value}`;
          } else {
            let redirectUrl = '';
            if (pathname.includes(`/${currentUrlLanguage}`)) {
              redirectUrl = pathname.replace(
                `/${currentUrlLanguage}`,
                `/${selectedDropdown?.href.value}`
              );
            } else {
              // To handle url that has no language locale
              redirectUrl = `/${selectedDropdown?.href.value}${pathname}`;
            }
            window.location.href = redirectUrl;
          }
        }}
      >
        <div className="hidden pr-5 hover:cursor-pointer lg:flex">
          <Typography variant="l1" fontWeight="bold">
            {selectedLang}
          </Typography>
          <Image
            src={`${publicUrl}/icon_header_arrow.svg`}
            alt="Lang"
            className="pl-[5px]"
            width={11}
            height={18}
          />
        </div>
      </DropDown>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

const UserProfile = () => {
  const { t, locale } = useI18n();
  const { userLoggedIn, isLoading } = useSelector((state: RootState) => state.userLoginStatus);
  const dispatch = useDispatch();
  useEffect(() => {
    try {
      fetch(SiteApiPaths.PROFILE_LOGGED)
        .then(async (response) => {
          const data = await response.json();
          if (data?.logged) {
            dispatch(setUserLoggedInState(true));
          }
        })
        .finally(() => {
          dispatch(setIsLoadingState(false));
        });
    } catch (err) {
      console.error(err);
    }
  }, []);
  try {
    if (isLoading) {
      return <></>;
    }
    return (
      <>
        <div className="hidden items-center gap-[5px] pr-5 lg:flex">
          <Image
            src={`${publicUrl}/icon_profile.svg`}
            alt="User"
            width={16}
            height={16}
            className="mt-[-4px]"
          />

          <Typography variant="l1" fontWeight="bold">
            {userLoggedIn ? (
              <>
                <a
                  href={GetLocaleUrl(SsoApiPaths.SIGN_IN_CALLBACK, locale())}
                  onClick={() => {
                    sendGTMEvent({
                      event: 'member_dashboard_interact',
                      intent: 'topnav membership cta',
                    });
                  }}
                >
                  {t(DICTIONARY_CONSTANT.SSO.Global.MEMBERSHIP)}
                </a>
              </>
            ) : (
              <>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    sendGTMEvent({
                      event: 'login_signip_interact',
                      login_or_signup: 'login',
                      step_number: 0,
                      step_name: 'pre-login',
                      intent: 'topnav login cta',
                    });
                    signIn('azureb2c', {
                      callbackUrl: GetLocaleUrl(SsoApiPaths.SIGN_IN_CALLBACK, locale()),
                      ui_locales: SitecoreLanguageToAzureB2CLanguageMapping[locale()],
                    });
                  }}
                >
                  {t(DICTIONARY_CONSTANT.SSO.Global.LOGIN)}
                </a>
                <> / </>
                <a
                  href={GetLocaleUrl(SsoApiPaths.SIGN_UP_CALLBACK, locale())}
                  onClick={() =>
                    sendGTMEvent({
                      event: 'login_signip_interact',
                      login_or_signup: 'signup',
                      step_number: 0,
                      step_name: 'pre-login',
                      intent: 'topnav signup cta',
                    })
                  }
                >
                  {t(DICTIONARY_CONSTANT.SSO.Global.SIGN_UP)}
                </a>
              </>
            )}
          </Typography>
        </div>
      </>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

const LocationDropdown = ({
  propertySiteConfigurationProp,
}: {
  propertySiteConfigurationProp: PropertySiteConfigurationProp;
}) => {
  try {
    const { t, locale } = useI18n();
    const [selectedLocation, setSelectedLocation] = useState(
      propertySiteConfigurationProp.fields.HomeLink
        ? propertySiteConfigurationProp.fields.HomeLink?.fields.Title.value
        : t(DICTIONARY_CONSTANT.HEADER.GLOBAL_LOCATION)?.toUpperCase() || ''
    );

    const dropdownItems =
      propertySiteConfigurationProp.fields.PropertyLinks.fields?.SelectedLinks?.map(
        (propertyLink) => {
          let newPropertyLink = JSON.parse(JSON.stringify(propertyLink));
          newPropertyLink.fields.Title.value =
            String(propertyLink.fields?.Title?.value)?.toUpperCase() || '';

          return { href: propertyLink.fields?.URL, text: newPropertyLink.fields?.Title };
        }
      );

    return (
      <DropDown
        dropdownItems={dropdownItems}
        minWidth="161px"
        onItemSelected={(name) => {
          const selectedDropdown = dropdownItems.find((element) => element.text.value == name);
          window.location.href = GetLocaleUrl(selectedDropdown?.href.value.href, locale());
        }}
      >
        <div className="hidden pr-5 hover:cursor-pointer lg:flex">
          <Typography variant="l1" fontWeight="bold">
            {String(selectedLocation)?.toUpperCase() || ''}
          </Typography>
          <Image
            src={`${publicUrl}/icon_header_arrow.svg`}
            alt="location"
            className="pl-[5px]"
            width={11}
            height={18}
          />
        </div>
      </DropDown>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

const AnimatedDiv = ({ children, className }) => {
  return (
    <motion.div
      exit={{ y: 0 }}
      initial={{ y: 40 }}
      animate={{ y: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const PropertyHeader = (
  propertySiteConfigurationProps:
    | PropertySiteConfigurationProp
    | PropertyEastResidenceSiteConfigurationProp
): JSX.Element => {
  try {
    const context = useSitecoreContext();
    const { route } = context.sitecoreContext;
    const pageFields = route?.fields as PageRouteFields & _PageMetadata;
    const { locale } = useI18n();

    const { isMobile } = useWindowSize();

    if (propertySiteConfigurationProps?.fields?.EASTResidenceText?.value) {
      propertySiteConfigurationProps.fields.EASTResidenceText.value =
        propertySiteConfigurationProps.fields.EASTResidenceText?.value?.toUpperCase() || '';
    }
    const pathname = usePathname();
    const isMiamiDesktopNotHome =
      ((pathname.includes('/miami') && pathname !== '/miami' && pathname !== '/miami/') ||
        (pathname.includes('/hongkong') && pathname !== '/hongkong' && pathname !== '/hongkong/') ||
        (pathname.includes('/beijing') && pathname !== '/beijing' && pathname !== '/beijing/')) &&
      !isMobile;

    // console.log('property site home link', propertySiteConfigurationProps.fields?.HomeLink);
    return (
      <header
        //bg-opacity-90
        className={`herobanner-section-container sticky top-0 z-20 flex h-[75px] w-full items-center justify-between bg-property p-[15px] backdrop-blur-xl lg:px-[20px] lg:py-[30px] ${isMiamiDesktopNotHome && 'mb-[64px]'}`}
      >
        <AnimatedDiv className="">
          <HtmlLink
            href={propertySiteConfigurationProps.fields?.HomeLink.fields?.URL?.value.href || ''}
          >
            {isMobile ? (
              <ScImage field={propertySiteConfigurationProps.fields?.IconMobile} />
            ) : (
              <ScImage
                field={propertySiteConfigurationProps.fields?.Icon}
                className={'header-logo'}
              />
            )}
          </HtmlLink>
        </AnimatedDiv>

        <AnimatedDiv className="!lg:translate-y-1/2 absolute left-[45%] !translate-x-[-50%] !transform lg:left-[50%]">
          {/* // mobile menu and desktop menu has different handling. */}
          <HeaderMenu
            siteMenu={propertySiteConfigurationProps.fields.SiteMenu}
            siteConfigurationProp={propertySiteConfigurationProps}
          />
        </AnimatedDiv>

        <AnimatedDiv className="flex items-center">
          {propertySiteConfigurationProps.fields.IsSSOEnabled.value && <UserProfile />}
          <div>
            <LanguageDropdown propertySiteConfigurationProps={propertySiteConfigurationProps} />
          </div>
          <div>
            <LocationDropdown propertySiteConfigurationProp={propertySiteConfigurationProps} />
          </div>
          {/* replace below btns by CTA Button */}
          {(propertySiteConfigurationProps as PropertyEastResidenceSiteConfigurationProp).fields
            .EASTResidenceLink && (
            <div className="hidden pr-5 lg:block">
              {/* <SitecoreLink
                  field={
                    (propertySiteConfigurationProps as PropertyEastResidenceSiteConfigurationProp)
                      .fields.EASTResidenceLink
                  }
                > */}
              <Link
                className="residence-link"
                href={
                  (propertySiteConfigurationProps as PropertyEastResidenceSiteConfigurationProp)
                    .fields.EASTResidenceLink.value.href || ''
                }
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = GetLocaleUrl(
                    (propertySiteConfigurationProps as PropertyEastResidenceSiteConfigurationProp)
                      .fields.EASTResidenceLink.value.href || '',
                    locale()
                  );
                }}
              >
                <Typography
                  variant="l1"
                  fontWeight="bold"
                  extraStyles="decoration-2 hover:underline hover:cursor-pointer underline-offset-4"
                >
                  <ScText
                    field={
                      (propertySiteConfigurationProps as PropertyEastResidenceSiteConfigurationProp)
                        .fields.EASTResidenceText
                    }
                  />
                </Typography>
              </Link>
              {/* </SitecoreLink> */}
            </div>
          )}
          <BookNow
            siteConfigurationProp={propertySiteConfigurationProps}
            isProperty={pageFields.IsPropertyPage.value || pageFields.IsPropertyInnerPage.value}
            hotelId={
              propertySiteConfigurationProps.fields.PropertyBookNowConfiguration?.fields.HotelId
            }
          />
        </AnimatedDiv>
      </header>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default withDatasourceCheck()<
  PropertySiteConfigurationProp | PropertyEastResidenceSiteConfigurationProp
>(PropertyHeader);
