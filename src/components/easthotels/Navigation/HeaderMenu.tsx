import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import Typography from '../Typography/Typography';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import { useWindowSize } from '@uidotdev/usehooks';
import MenuTab from './HeaderMenuTab';

import { useI18n } from 'next-localization';
import DropDown from '../CustomTypes/Components/DropDown';
import { MenuTabContent } from './HeaderMenuTabContent';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import { SiteConfigurationProp } from '@/props/SiteConfigurationProp';
import {
  HeaderMegaMenus,
  NavigationLinkProp,
  NavigationLinksProp,
} from '@/props/Navigation/NavigationProps';
import { Field, TextField, useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';
import { PageRouteFields } from '@/props/Core/PageProps';
import { _PageMetadata } from '@/props/common/_PageMetadata';
import ComponentError from '../Error/ComponentError';
import {
  GetLocaleUrl,
  SitecoreLanguageToAzureB2CLanguageMapping,
  SitecoreLanguageToURLMapping,
} from '@/utilities/LanguageUtilities';
import { SitecoreLink } from '../CustomTypes/Components/SitecoreLink';
import { usePathname } from 'next/navigation';
import { string } from 'zod';
import Image from 'next/image';
import { SsoApiPaths } from '@/utilities/SsoConstant';
import { useSelector } from 'react-redux';
import { RootState } from 'lib/redux/store';
import { sendGTMEvent } from '@next/third-parties/google';
import { signIn } from 'next-auth/react';

const publicUrl = getPublicUrl();

const LocationDropdown = ({
  siteConfigurationProp,
}: {
  siteConfigurationProp: SiteConfigurationProp;
}) => {
  try {
    const { t, locale } = useI18n();

    const [selectedLocation, setSelectedLocation] = useState(
      siteConfigurationProp.fields.HomeLink
        ? String(siteConfigurationProp.fields.HomeLink?.fields.Title.value)?.toUpperCase() || ''
        : t(DICTIONARY_CONSTANT.HEADER.GLOBAL_LOCATION)?.toUpperCase() || ''
    );

    const dropdownItems = siteConfigurationProp.fields?.PropertyLinks?.fields?.SelectedLinks?.map(
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
        // Width="100%"
        onItemSelected={(name) => {
          setSelectedLocation(name);
          const selectedDropdown = dropdownItems.find((element) => element.text.value == name);
          window.location.href = GetLocaleUrl(selectedDropdown?.href.value.href, locale());
        }}
      >
        <div className="flex justify-between border p-3 hover:cursor-pointer">
          <Typography variant="l3" fontWeight="bold">
            {selectedLocation}
          </Typography>
          <Image
            src={`${publicUrl}/icon_header_arrow.svg`}
            alt="location"
            className="mt-[-4px] pl-[5px]"
            width={11}
            height={25}
          />
        </div>
      </DropDown>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};
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
          newLanguageLink.fields.LanguageText.value = String(
            newLanguageLink.fields.LanguageText.value?.toUpperCase() || ''
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

    return (
      <DropDown
        dropdownItems={dropdownItems}
        // minWidth="85px"
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
        <div className="flex border p-3 hover:cursor-pointer">
          <Typography variant="l3" fontWeight="bold">
            {selectedLang}
          </Typography>
          <Image
            src={`${publicUrl}/icon_header_arrow.svg`}
            alt="Lang"
            className="mt-[-4px] pl-[5px]"
            width={11}
            height={25}
          />
        </div>
      </DropDown>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};
const HeaderMenu = ({
  siteMenu,
  siteConfigurationProp,
}: {
  siteMenu: NavigationLinksProp;
  siteConfigurationProp: SiteConfigurationProp;
}) => {
  try {
    const pathname = usePathname();
    const windowSize = useWindowSize();
    const isMobile = windowSize?.width <= 991;

    const isLocationDesktop =
      (pathname.toLowerCase().includes('/miami') ||
        pathname.toLowerCase().includes('/hongkong') ||
        pathname.toLowerCase().includes('/beijing')) &&
      !isMobile;

    // const scrollCountRef = useRef(0);

    const [selectedTab, setSelectedTab] = useState('');
    const [openMenu, setOpenMenu] = useState(false);

    const { t, locale } = useI18n();

    const context = useSitecoreContext();
    const { route } = context.sitecoreContext;
    const pageFields = route?.fields as PageRouteFields & _PageMetadata;

    const { userLoggedIn, isLoading } = useSelector((state: RootState) => state.userLoginStatus);

    let userAgent = window?.navigator.userAgent;
    const os = useMemo(() => {
      if (userAgent.indexOf('Win') != -1) return 'Windows';
      if (userAgent.indexOf('Mac') != -1) return 'MacOS';
      return 'Unknown';
    }, [userAgent]);

    useEffect(() => {
      setOpenMenu(isLocationDesktop);
    }, [isLocationDesktop]);

    // window.onscroll = () => {
    //   if (window.scrollY > 200 && scrollCountRef.current !== 0) {
    //     setOpenMenu(false);
    //   }

    //   scrollCountRef.current = scrollCountRef.current + 1;
    // };

    return (
      //modal:false to enable interaction with other page elements, will allow page scroll even sheet is open
      <Sheet open={openMenu} onOpenChange={setOpenMenu} modal={false}>
        <SheetTrigger
          asChild
          className="cursor-pointer"
          style={{
            WebkitAppearance: 'none',
          }}
        >
          {/* <Image src={`${publicUrl}/icon_menu.svg`} alt="Menu" onClick={() => setSelectedTab('')} /> */}
          <img src={`${publicUrl}/icon_menu.svg`} alt="Menu" onClick={() => setSelectedTab('')} />
        </SheetTrigger>
        {isMobile ? (
          <SheetContent
            side={'top'}
            //bg-opacity-90
            className={`mt-[74px] h-full ${pageFields.IsPropertyPage ? 'bg-property' : 'bg-brand'} p-0 backdrop-blur-xl focus:outline-none ${openMenu ? '!opacity-100' : '!opacity-0'}`}
          >
            <SheetHeader>
              <SheetTitle className="relative flex w-screen">
                <div className="w-[80%]">
                  <LocationDropdown siteConfigurationProp={siteConfigurationProp} />
                </div>
                <div className="w-[20%]">
                  <LanguageDropdown siteConfigurationProp={siteConfigurationProp} />
                </div>
              </SheetTitle>
            </SheetHeader>

            {siteConfigurationProp.fields.IsSSOEnabled.value && !isLoading && (
              <div className="mx-4 my-[40px] flex items-center gap-[5px]">
                <Image
                  src={`${publicUrl}/icon_profile.svg`}
                  alt="profile icon"
                  width={16}
                  height={16}
                  className="mb-[2px]"
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
            )}
            <div className="mx-4">
              <MenuTab
                selectedTabObj={siteMenu.fields.SelectedLinks.find(
                  (tab) => tab.fields.Title.value === selectedTab
                )}
                tabs={siteMenu.fields.SelectedLinks.map(
                  (link, number) => link.fields.Title.value as string
                )}
                tabObjs={siteMenu.fields.SelectedLinks}
                selectedTab={selectedTab}
                onClickTab={(tab: string, actionType: string | undefined) => {
                  setSelectedTab(tab);

                  const TabItem = siteMenu.fields.SelectedLinks.find(
                    (link, number) => link.fields.Title.value === tab
                  );
                  if (
                    // (TabItem as NavigationLinksProp)?.fields.SelectedLinks == undefined ||
                    // (TabItem as NavigationLinksProp)?.fields.SelectedLinks.length == 0
                    actionType == 'goToPage'
                  ) {
                    var tabItemUrl =
                      (TabItem as NavigationLinkProp)?.fields.CTAUrl?.value.href ||
                      TabItem?.fields.URL.value.href;
                    window.location.href = GetLocaleUrl(tabItemUrl, locale());
                  }
                }}
                // subMenu={
                //   mobileMenu.find((tab: { title: string }) => tab.title === selectedTab)?.subMenu || []
                // }
                subMenu={
                  (
                    siteMenu.fields.SelectedLinks.find(
                      (link, number) => link.fields.Title.value === selectedTab
                    ) as NavigationLinksProp
                  )?.fields.SelectedLinks?.map((link: NavigationLinkProp, number) => {
                    return { text: link.fields.Title.value!, url: link.fields.URL.value.href! };
                  }) || []
                }
                //hasSubMenu={mobileMenu.map((tab: { subMenu: any }) => !!tab.subMenu)}
                hasSubMenu={siteMenu.fields.SelectedLinks.map(
                  (link, number) => link.fields.SelectedLinks?.length > 0
                )}
                closeMenu={() => setOpenMenu(false)}
              />
            </div>
          </SheetContent>
        ) : (
          <SheetContent
            side={'top'}
            //bg-opacity-90
            className={`${os === 'Windows' ? 'header-submenu-win' : 'header-submenu'} mt-[75px] max-h-screen max-h-screen overflow-y-scroll ${pageFields.IsPropertyPage?.value ? 'bg-property' : 'bg-brand'} p-0 backdrop-blur-xl focus:outline-none`}
            onInteractOutside={(event) => event.preventDefault()}
          >
            <SheetHeader>
              <SheetTitle>
                <MenuTab
                  tabs={siteMenu.fields.SelectedLinks.map(
                    (tab: { fields: { Title: TextField } }) => tab.fields.Title.value
                  )}
                  selectedTab={selectedTab}
                  onClickTab={(tab) => {
                    setSelectedTab(tab);
                    const TabItem = siteMenu.fields.SelectedLinks.find(
                      (item: { fields: { Title: TextField } }) => item.fields.Title.value === tab
                    );

                    // If selectedlinks exists mean it has submenu
                    !TabItem?.fields.SelectedLinks &&
                      (window.location.href = GetLocaleUrl(
                        TabItem?.fields.URL.value.href,
                        locale()
                      ));
                  }}
                />
              </SheetTitle>
            </SheetHeader>
            {selectedTab &&
              (
                siteMenu.fields.SelectedLinks.find(
                  (tab: { fields: { Title: TextField } }) => tab.fields.Title.value === selectedTab
                ) as HeaderMegaMenus
              )?.fields.SelectedLinks && (
                <>
                  <MenuTabContent
                    tab={siteMenu.fields.SelectedLinks.find(
                      (tab: { fields: { Title: TextField } }) =>
                        tab.fields.Title.value === selectedTab
                    )}
                    Content={
                      siteMenu.fields.SelectedLinks.find(
                        (tab: { fields: { Title: TextField } }) =>
                          tab.fields.Title.value === selectedTab
                      ) as HeaderMegaMenus
                    }
                    isPropertyPage={pageFields.IsPropertyPage}
                    closeMenu={() => setOpenMenu(false)}
                  />
                  {pageFields.IsPropertyPage?.value && (
                    <SheetFooter className="bg-green-primary">
                      <SitecoreLink
                        field={siteConfigurationProp.fields.MainSite}
                        className="mx-[30px] my-[15px] flex items-start gap-[5px]"
                      >
                        <Typography variant="l1" fontColor="white" fontWeight="bold">
                          {t(DICTIONARY_CONSTANT.HEADER.VISIT_MAIN_SITE)}
                        </Typography>
                        <Image
                          src={`${publicUrl}/icon_visit_website_2.svg`}
                          alt="plus icon"
                          width={12}
                          height={12}
                        />
                      </SitecoreLink>
                    </SheetFooter>
                  )}
                </>
              )}
          </SheetContent>
        )}
      </Sheet>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default HeaderMenu;
