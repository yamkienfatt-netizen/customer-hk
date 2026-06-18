import { useState } from 'react';
import ListingSwiper from '../Article/ListingSwiper';
import RichTextTypography from '../Typography/RichTextTypography';
import Typography from '../Typography/Typography';
import { HeaderMegaMenus, NavigationLinkProp } from '@/props/Navigation/NavigationProps';
import {
  ImageField,
  LinkField,
  Text as ScText,
  RichText as ScRichText,
  TextField,
  Field,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { SitecoreLink } from '../CustomTypes/Components/SitecoreLink';
import { _SimpleText } from '@/props/common/_SimpleText';
import FadeInUp from '../Animation/FadeInUp';
import { Treelist } from '@/props/fields/ScField';
import CTAButton from '../Button/CTAButton';
import ComponentError from '../Error/ComponentError';
import { usePathname } from 'next/navigation';
import { useI18n } from 'next-localization';

// Users should be able to choose weather they would like to use
// 1. Standard menu (text only)
// 2. Mega menu (with images)
// 3. Mega menu (with images and description)

export const HeaderSimpleText = ({
  simpleTextProps,
  verticalDivider = false,
}: {
  simpleTextProps: _SimpleText;
  verticalDivider: boolean;
}) => {
  try {
    const sitecoreContext = useSitecoreContext();
    const isPageEditing = sitecoreContext.sitecoreContext.pageEditing
      ? sitecoreContext.sitecoreContext.pageEditing
      : false;

    return (
      <FadeInUp>
        <div className={verticalDivider && 'verticalLine'}>
          {(simpleTextProps.Title || isPageEditing) && (
            <div className={'mb-[20px]'}>
              <Typography variant="h4">
                <ScText field={simpleTextProps.Title} />
              </Typography>
            </div>
          )}

          {(simpleTextProps.Description || isPageEditing) && (
            <div className="mb-[20px]">
              <Typography variant="l3" fontWeight="bold">
                <ScText field={simpleTextProps.Description} />
              </Typography>
            </div>
          )}

          {(simpleTextProps.Content || isPageEditing) && (
            <RichTextTypography>
              <ScRichText field={simpleTextProps.Content} />
            </RichTextTypography>
          )}
        </div>
      </FadeInUp>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export const MenuTabContent = ({
  tab,
  Content,
  isPropertyPage,
  closeMenu,
}: {
  tab: HeaderMegaMenus;
  Content: HeaderMegaMenus;
  isPropertyPage: Field<boolean>;
  closeMenu: () => void;
}) => {
  try {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const pathname = usePathname();
    const { locale } = useI18n();

    return (
      <div className="herobanner-section-container my-[60px] flex flex-col justify-center lg:flex-row">
        <div className="ml-[30px] max-w-[300px]">
          <div className="mb-[40px]">
            <Typography variant="h2" font="Bellefair">
              <ScText field={tab.fields.Title} />
            </Typography>
          </div>
          <div className="pb-[30px] lg:pb-[40px]">
            <RichTextTypography>
              <ScText field={tab.fields.Description} />
            </RichTextTypography>
          </div>
          {tab?.fields.CTAText.value !== '' && (
            <div
              onClick={() => {
                if (tab?.fields.CTAUrl.value.href + '/' == `/${locale()}${pathname}`) {
                  closeMenu();
                }
              }}
            >
              <div className="mb-[20px]">
                <CTAButton
                  variant="contained-big"
                  url={tab?.fields.CTAUrl as LinkField}
                  text={tab?.fields.CTAText as TextField}
                  fontColor="white"
                  bgColor="green-primary"
                ></CTAButton>
              </div>
            </div>
          )}

          {tab?.fields.SelectedCTA &&
            tab?.fields.SelectedCTA.map((cta, index) => {
              return (
                <div
                  onClick={() => {
                    if (cta.fields.URL.value.href + '/' == `/${locale()}${pathname}`) {
                      closeMenu();
                    }
                  }}
                >
                  <div className="mb-[20px]">
                    <CTAButton
                      variant="contained-big"
                      url={cta.fields.URL as LinkField}
                      text={cta.fields.Text as TextField}
                      fontColor="white"
                      bgColor="green-primary"
                    ></CTAButton>
                  </div>
                </div>
              );
            })}
        </div>
        {Content?.fields?.IsMegaMenu.value ? (
          // MEGA MENU
          <ListingSwiper
            articleData={Content}
            spaceBetween={30}
            isMenu={true}
            isPropertyPage={isPropertyPage}
            closeMenu={closeMenu}
          />
        ) : Content?.fields?.IsContent.value ? (
          <div className={'ml-[30px] w-[900px]'}>
            <div className="grid grid-cols-2 justify-between gap-[20px]">
              {Content?.fields.SelectedArticles[0] && (
                <HeaderSimpleText
                  simpleTextProps={Content.fields.SelectedArticles[0]?.fields}
                  verticalDivider={Content?.fields.SelectedArticles[1] ? true : false}
                ></HeaderSimpleText>
              )}

              {Content?.fields.SelectedArticles[1] && (
                <HeaderSimpleText
                  simpleTextProps={Content.fields.SelectedArticles[1]?.fields}
                  verticalDivider={false}
                ></HeaderSimpleText>
              )}
            </div>
          </div>
        ) : (
          // TEXT MENU
          <div className="ml-[30px] w-[900px]">
            {Content?.fields.SelectedLinks?.map((item: NavigationLinkProp, index: Number) => (
              <div className="w-fit">
                <SitecoreLink
                  field={item.fields.URL}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <Typography
                    variant="h4"
                    key={index}
                    extraStyles={`mb-[25px] hover:opacity-100 ${hoveredIndex !== null ? 'opacity-50' : ''}`}
                    hoverEffect="hoverUnderline"
                  >
                    <ScText field={item.fields.Title} />
                  </Typography>
                </SitecoreLink>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};
