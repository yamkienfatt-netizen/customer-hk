import { HtmlLink } from '../CustomTypes/Components/HtmlLink';
import React, { useEffect, useState, JSX } from 'react';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import {
  Image as ScImage,
  useSitecoreContext,
  withDatasourceCheck,
} from '@sitecore-jss/sitecore-jss-nextjs';
import Typography from '../Typography/Typography';
import useWindowSize from 'src/hooks/useWindowSize';
import DropDown from '../CustomTypes/Components/DropDown';
import { SiteConfigurationProp } from '@/props/SiteConfigurationProp';
import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import BookNow from 'components/easthotels/StayAtEast/BookNow';
import { motion } from 'framer-motion';
import HeaderMenu from 'components/easthotels/Navigation/HeaderMenu';
import { usePathname } from 'next/navigation';
import {
  GetLocaleUrl,
  SitecoreLanguageToAzureB2CLanguageMapping,
  SitecoreLanguageToURLMapping,
} from '@/utilities/LanguageUtilities';
import { string } from 'zod';
import ComponentError from '../Error/ComponentError';
import { SabreForm, SsoApiPaths } from '@/utilities/SsoConstant';
import Image from 'next/image';
import { sendGTMEvent } from '@next/third-parties/google';
import { signIn } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'lib/redux/store';
import {
  setIsLoadingState,
  setMemberIdState,
  setUserLoggedInState,
} from 'lib/redux/features/userLoginStatus';
import { SiteApiPaths } from '@/utilities/LinkUtilities';

const publicUrl = getPublicUrl();

const LanguageDropdown = ({
  siteConfigurationProp,
}: {
  siteConfigurationProp: SiteConfigurationProp;
}) => {
  try {
    const pathname = usePathname();
    const { t, locale } = useI18n();
    const currentUrlLanguage = SitecoreLanguageToURLMapping[
      locale() as keyof typeof string
    ] as string;

    const dropdownItems =
      siteConfigurationProp.fields?.SiteLanguages?.fields?.SupportedLanguages?.map(
        (languageLink) => {
          let newLanguageLink = JSON.parse(JSON.stringify(languageLink));
          newLanguageLink.fields.LanguageText.value =
            String(newLanguageLink.fields.LanguageText.value?.toUpperCase()) || '';
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
          <Typography variant="l1" fontWeight="bold" className="!mb-0">
            {selectedLang}
          </Typography>
          <Image
            src={`${publicUrl}/icon_header_arrow.svg`}
            alt="Lang"
            className="mt-[-4px] pl-[5px]"
            width={11}
            height={22}
          />
        </div>
      </DropDown>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

interface sabre {
  Token: string;
}

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
            dispatch(setMemberIdState(data.memberId));
            dispatch(setUserLoggedInState(true));
          } else {
            dispatch(setMemberIdState(undefined));
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
  siteConfigurationProp,
}: {
  siteConfigurationProp: SiteConfigurationProp;
}) => {
  try {
    const { t, locale } = useI18n();

    const [selectedLocation, setSelectedLocation] = useState(
      t(DICTIONARY_CONSTANT.HEADER.GLOBAL_LOCATION)?.toUpperCase() || ''
    );

    const dropdownItems = siteConfigurationProp.fields?.PropertyLinks?.fields?.SelectedLinks?.map(
      (propertyLink) => {
        let newPropertyLink = JSON.parse(JSON.stringify(propertyLink));
        newPropertyLink.fields.Title.value =
          String(propertyLink.fields?.Title.value)?.toUpperCase() || '';
        return { href: propertyLink.fields?.URL, text: newPropertyLink.fields?.Title };
      }
    );

    return (
      <DropDown
        dropdownItems={dropdownItems}
        minWidth="161px"
        onItemSelected={(name) => {
          setSelectedLocation(name);
          const selectedDropdown = dropdownItems.find((element) => element.text.value == name);
          window.location.href = GetLocaleUrl(selectedDropdown?.href.value.href, locale());
        }}
      >
        <div className="hidden pr-5 hover:cursor-pointer lg:flex">
          {/* <Typography variant="l1">{t(DICTIONARY_CONSTANT.HEADER.GLOBAL_LOCATION)}</Typography> */}
          <Typography variant="l1" fontWeight="bold" className="!mb-0">
            {selectedLocation?.toUpperCase() || ''}
          </Typography>
          <Image
            src={`${publicUrl}/icon_header_arrow.svg`}
            alt="location"
            className="mt-[-4px] pl-[5px]"
            width={11}
            height={22}
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

const Default = (siteConfigurationProp: SiteConfigurationProp): JSX.Element => {
  try {
    const { isMobile } = useWindowSize();
    const { sitecoreContext } = useSitecoreContext();
    const { t } = useI18n();

    const handleSabreSubmit = async () => {
      try {
        const err_msg = t(DICTIONARY_CONSTANT.SSO.Global.INVALID_API);
        const response = await fetch(`/api/booking/sabreLogin`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.status == 200) {
          const data = (await response.json()) as sabre;
          const form = document.getElementById('SabreForm') as HTMLFormElement;
          form.action = SabreForm.URL;
          (document.getElementById('SabreSession') as HTMLInputElement).value = data.Token;
          (document.getElementById('SabreChain') as HTMLInputElement).value =
            SabreForm.SHG_CHAIN_ID;
          form.submit();
          //do form post using this data.Token as per doc
        } else {
          console.log(err_msg);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    return (
      <>
        <header
          // bg-opacity-90
          className="herobanner-section-container fixed top-0 z-20 flex h-[75px] w-full items-center justify-between bg-brand  p-[15px] backdrop-blur-xl lg:px-[20px] lg:py-[30px]"
        >
          <AnimatedDiv className="">
            <HtmlLink href="/">
              {isMobile ? (
                <ScImage field={siteConfigurationProp.fields?.IconMobile} />
              ) : (
                <ScImage field={siteConfigurationProp.fields?.Icon} className={'header-logo'} />
              )}
            </HtmlLink>
          </AnimatedDiv>

          <AnimatedDiv className="!lg:translate-y-1/2 absolute left-[45%] !translate-x-[-50%] !transform lg:left-[50%]">
            {/* // mobile menu and desktop menu has different handling. */}
            <HeaderMenu
              siteMenu={siteConfigurationProp.fields.SiteMenu}
              siteConfigurationProp={siteConfigurationProp}
            />
          </AnimatedDiv>

          <AnimatedDiv className="flex items-center">
            {siteConfigurationProp.fields.IsSSOEnabled.value && <UserProfile />}
            <LanguageDropdown siteConfigurationProp={siteConfigurationProp} />
            <LocationDropdown siteConfigurationProp={siteConfigurationProp} />
            <BookNow siteConfigurationProp={siteConfigurationProp} />
            {/*
            {!sitecoreContext.route?.fields?.NeedAuthentication?.value && (
              <BookNow siteConfigurationProp={siteConfigurationProp} />
            )}
            {sitecoreContext.route?.fields?.NeedAuthentication?.value && (
              <div className="hover:cursor-pointer">
                <div className="bg-green-primary">
                  <div className="flex flex min-h-[34px] min-w-[96px] items-center justify-center bg-green-primary px-[20px] py-[9px] lg:min-w-[106px]">
                    <div className="relative overflow-hidden">
                      <div style={{ opacity: '1', transform: 'none' }}>
                        <button
                          type="button"
                          className="!mb-0 font-[Amiko] text-[13px] font-bold leading-[18px] tracking-[0.88px]"
                          style={{ color: 'white', borderColor: 'white' }}
                          onClick={handleSabreSubmit}
                        >
                          {t(DICTIONARY_CONSTANT.RESERVATIONS.BOOK_NOW)?.toUpperCase() || ''}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            */}
          </AnimatedDiv>
        </header>
        <form id="SabreForm" method="POST">
          <input id="SabreSession" name="session" type="hidden" />
          <input id="SabreChain" name="chain" type="hidden" />
        </form>
      </>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default withDatasourceCheck()<SiteConfigurationProp>(Default);
