import { useState } from 'react';
import Typography from '../Typography/Typography';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import ComponentError from '../Error/ComponentError';
import { HtmlLink } from '../CustomTypes/Components/HtmlLink';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

interface SubMenuTab {
  url: string;
  text: string;
}

const publicUrl = getPublicUrl();
interface MenuTabProps {
  tabs: string[];
  selectedTab: string;
  onClickTab: (tab: string, actionType: string | undefined) => void;
  subMenu?: SubMenuTab[];
  hasSubMenu?: any;
}
const tabStyles = 'whitespace-nowrap hover:cursor-pointer';
const TabItem = ({
  tab,
  selectedTab,
  onClickTab,
}: {
  tab: string;
  selectedTab: string;
  onClickTab: (tab: string) => void;
}) => {
  try {
    return (
      <>
        <Typography
          variant="l3"
          fontColor={selectedTab === '' || selectedTab === tab ? '#1d2021' : '#1d20214D'}
          fontWeight="bold"
          onClick={() => onClickTab(tab)}
          extraStyles={`inline-block !mb-0 ${tabStyles}`}
        >
          {tab}
        </Typography>
      </>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

const TabItemMobile = ({
  tab,
  onClickTab,
  hasSubMenu,
  // selectedTabObj,
  openSubMenuAction,
}: {
  tab: string;
  onClickTab: (tab: string, action: string | undefined) => void;
  hasSubMenu: boolean;
  openSubMenuAction: () => void;
}) => {
  try {
    return (
      <div className="my-[20px] flex items-center gap-[5px]">
        <div onClick={() => onClickTab(tab, 'goToPage')}>
          <Typography variant="h4" fontColor={'#1d2021'} extraStyles={`${tabStyles}`}>
            {tab}
          </Typography>
        </div>

        {hasSubMenu && (
          <div
            onClick={() => {
              openSubMenuAction();
              onClickTab(tab, 'expandSubMenu');
            }}
            className={`${tabStyles}`}
          >
            <Image
              src={`${publicUrl}/icon_mobile_menu_plus.svg`}
              alt="plus icon"
              width={16}
              height={16}
              className="mb-[2px]"
            />
          </div>
        )}
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};
const MenuTab = ({
  selectedTabObj,
  tabs,
  selectedTab,
  onClickTab,
  subMenu,
  hasSubMenu,
  closeMenu,
  tabObjs,
}: MenuTabProps) => {
  try {
    const [openSubMenu, setOpenSubMenu] = useState(false);
    const { t, locale } = useI18n();
    const pathname = usePathname();

    return (
      <>
        <div className="herobanner-section-container hidden border-y lg:block">
          {/* desktop menu tabs */}
          <div className="mx-[30px] my-[20px] flex flex-nowrap  justify-around overflow-x-auto overflow-y-clip scrollbar-hide">
            {tabs?.map((tab, index) => (
              <TabItem tab={tab} selectedTab={selectedTab} onClickTab={onClickTab} key={index} />
            ))}
          </div>
        </div>
        {/* mobile menu tabs */}
        <div className="lg:hidden">
          {!openSubMenu &&
            tabs.map((tab, index) => (
              <TabItemMobile
                tab={tab}
                // onClickTab={() => {
                //    onClickTab(tab);
                //   if (hasSubMenu && hasSubMenu.length > index && hasSubMenu[index]) {
                //     setOpenSubMenu(true);
                //   }
                // }}
                openSubMenuAction={() => {
                  if (hasSubMenu && hasSubMenu.length > index && hasSubMenu[index]) {
                    setOpenSubMenu(true);
                  }
                }}
                onClickTab={onClickTab}
                key={index}
                hasSubMenu={hasSubMenu && hasSubMenu.length > index ? hasSubMenu[index] : false}

                // selectedTabObj={selectedTabObj}
              />
            ))}

          {openSubMenu && hasSubMenu && (
            <>
              <div className="my-[20px]  flex gap-[5px]">
                <Image
                  src={`${publicUrl}/icon_mobile_menu_back_2.svg`}
                  alt="plus icon"
                  width={16}
                  height={16}
                />
                <Typography
                  variant="l3"
                  fontColor={'#1d2021'}
                  onClick={() => {
                    setOpenSubMenu(false);
                  }}
                  extraStyles={`${tabStyles}`}
                >
                  {t(DICTIONARY_CONSTANT.HEADER.BACK)}
                </Typography>
              </div>

              {/* {selectedTabObj?.fields?.Title?.value &&
                selectedTabObj.fields?.CTAUrl?.value?.href && (
                  <div
                    onClick={() => {
                      // console.log('onClick', {
                      //   pathname: pathname,
                      //   pressedLink: selectedTabObj?.fields?.CTAUrl?.value?.href + '/',
                      //   selectedTabObj: selectedTabObj,
                      // });
                      if (
                        (selectedTabObj?.fields?.CTAUrl?.value?.href + '/')?.toLowerCase() ==
                        pathname?.toLowerCase()
                      ) {
                        closeMenu();
                      }
                    }}
                  >
                    <div className="mb-[20px]">
                      <HtmlLink href={selectedTabObj.fields?.CTAUrl?.value?.href}>
                        <div className="my-[20px] flex items-center  gap-[5px]">
                          <Typography variant="h4" fontColor={'#1d2021'}>
                            {selectedTabObj?.fields?.Title?.value}
                          </Typography>
                        </div>
                      </HtmlLink>
                    </div>
                  </div>
                )} */}

              {subMenu?.map((tab: any, index) => (
                <HtmlLink href={tab.url}>
                  <TabItemMobile
                    tab={tab.text}
                    onClickTab={() => {
                      // const pressedLink = tab.url.endsWith('/') ? tab.url : tab.url + '/';
                      // const pathnameWithEndingSlash = pathname?.endsWith('/')
                      //   ? pathname
                      //   : pathname + '/';

                      // if (pressedLink?.toLowerCase() == pathnameWithEndingSlash?.toLowerCase()) {
                      //   closeMenu();
                      // } else {
                      //   closeMenu();
                      //   // onClickTab(tab, '');
                      //   setOpenSubMenu(true);
                      // }
                      closeMenu();
                    }}
                    key={index}
                    subMenu={undefined}
                  />
                </HtmlLink>
              ))}
            </>
          )}
        </div>
      </>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default MenuTab;
