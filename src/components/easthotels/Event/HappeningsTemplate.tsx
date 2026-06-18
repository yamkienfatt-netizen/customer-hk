import React from 'react';
import FadeInUp from 'components/easthotels/Animation/FadeInUp';
import Typography from 'components/easthotels/Typography/Typography';
import ShareButtions from 'components/easthotels/Social/ShareButtons';
import { Button } from 'components/ui/button';
import RichTextTypography from 'components/easthotels/Typography/RichTextTypography';
import { HappeningsTemplateProps } from '@/props/media/HappeningsTemplateProps';
import {
  Text as ScText,
  Image as ScImage,
  Placeholder as ScPlaceholder,
  RichText as ScRichText,
  useSitecoreContext,
  LayoutServicePageState,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { SitecoreLink } from '../CustomTypes/Components/SitecoreLink';
import { PageRouteFields } from '@/props/Core/PageProps';
import { _ArticleCard } from '@/props/common/_ArticleCard';
import { _Happening } from '@/props/common/_Happening';
import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import ComponentError from '../Error/ComponentError';

const HappeningsTemplate = (happeningsTemplateProps: HappeningsTemplateProps) => {
  try {
    const context = useSitecoreContext();
    const { route } = context.sitecoreContext;
    const pageFields = route?.fields as PageRouteFields & _ArticleCard & _Happening;
    const isPageEditing = context.sitecoreContext.pageState === LayoutServicePageState.Edit;

    const happeningTemplate1PlaceholderKey = `happeningtemplate-1`;
    const happeningTemplate2PlaceholderKey = `happeningtemplate-2`;

    const { t } = useI18n();
    const sitecoreCss = happeningsTemplateProps.params?.Styles ?? '';
    return (
      // <FadeInUp>
      <div
        className={
          `small-section-container mx-auto !mt-0 max-w-[374px] lg:!mt-[20px] lg:max-w-[1280px] ` +
          sitecoreCss
        }
      >
        <div className="flex flex-col gap-[22px] lg:mx-[50px] lg:flex-row lg:gap-[50px]">
          <div className={`max-h-[450px] max-w-[374px] overflow-hidden lg:hidden`}>
            {/* Todo: Need to confirm whether this required cta */}
            {/* <a href={URL?.value.href}>
                <img src={Image.value?.src} alt={`${Title.value} IMG`} className="h-full w-full" />
              </a> */}
            <ScImage field={pageFields.Image} className="h-full w-full" />
          </div>

          <div className="mx-[15px] max-w-[590px] lg:mt-[30px] lg:flex-1">
            {(isPageEditing || pageFields.Legend?.value) && (
              <div className={`mb-[20px] flex flex-row justify-between`}>
                <Typography variant="l3" fontWeight="bold" extraStyles="opacity-50">
                  <ScText field={pageFields.Legend} />
                </Typography>
                {/* TODO: use sitecore data. maybe PublishDate? as Date has already been used */}
                <Typography variant="l3" extraStyles="opacity-50 hidden lg:block">
                  <ScText field={pageFields.Legend2} />
                </Typography>
              </div>
            )}
            {(isPageEditing || pageFields.Title?.value) && (
              <div className={` mb-[15px] lg:mb-[10px]`}>
                <Typography variant="h2" font="Bellefair">
                  <ScText field={pageFields.Title} />
                </Typography>
              </div>
            )}
            {(isPageEditing || pageFields.SubTitle?.value) && (
              <Typography variant="l3">
                <ScText field={pageFields.SubTitle} />
              </Typography>
            )}

            <div className={'my-[40px] lg:mb-[50px]'}>
              <ShareButtions />
            </div>

            <ScPlaceholder
              name={happeningTemplate1PlaceholderKey}
              rendering={happeningsTemplateProps.rendering}
            />

            <div className="hidden flex-row gap-[70px] lg:flex">
              {(isPageEditing || pageFields.Date?.value || pageFields.Time?.value) && (
                <div className="mb-[30px]">
                  <Typography variant="l1" fontWeight="bold" extraStyles="mb-[10px]">
                    {t(DICTIONARY_CONSTANT.HAPPENING.TIME_LABEL)}
                  </Typography>
                  {(isPageEditing || pageFields.Date?.value) && (
                    <Typography variant="p">
                      <ScText field={pageFields.Date} />
                    </Typography>
                  )}
                  {(isPageEditing || pageFields.Time?.value) && (
                    <Typography variant="p">
                      <ScText field={pageFields.Time} />
                    </Typography>
                  )}
                </div>
              )}
              {(isPageEditing || pageFields.Location?.value) && (
                <div className="mb-[30px]">
                  <Typography variant="l1" fontWeight="bold" extraStyles="mb-[10px]">
                    {t(DICTIONARY_CONSTANT.HAPPENING.LOCATION_LABEL)}
                  </Typography>
                  <Typography variant="p">
                    <ScText field={pageFields.Location} />
                  </Typography>
                </div>
              )}
            </div>

            {(isPageEditing || pageFields.Date?.value || pageFields.Time?.value) && (
              <Typography variant="p" extraStyles="lg:hidden">
                <ScText field={pageFields.Date} /> | <ScText field={pageFields.Time} />
              </Typography>
            )}
            {(isPageEditing || pageFields.Location?.value) && (
              <Typography variant="p" extraStyles="lg:hidden">
                <ScText field={pageFields.Location} />
              </Typography>
            )}

            {(isPageEditing ||
              pageFields.Date?.value ||
              pageFields.Time?.value ||
              pageFields.Location?.value) && <div className="mb-[30px]" />}

            {(isPageEditing || pageFields.Content?.value) && (
              <div className="mb-[30px] lg:mb-[50px]">
                <RichTextTypography>
                  <ScRichText field={pageFields.Content} />
                </RichTextTypography>
              </div>
            )}

            {/* <ScPlaceholder
                name={happeningTemplate2PlaceholderKey}
                rendering={happeningsTemplateProps.rendering}
              /> */}

            {/* Todo: Convert this into a separate component */}
            {(isPageEditing || pageFields.URL.value.href) && (
              <SitecoreLink field={pageFields.URL}>
                <Button className=" w-full max-w-[345px] items-center justify-center bg-green-primary py-[11px]  lg:w-[300px]">
                  <Typography variant="l3" fontColor={'white'} fontWeight="bold" extraStyles="pt-1">
                    <ScText field={pageFields.Text} />
                  </Typography>
                </Button>
              </SitecoreLink>
            )}
          </div>

          <div
            className={`hidden max-h-[672px] max-w-[560px] overflow-visible lg:sticky lg:top-[75px] lg:block lg:flex-1`}
          >
            {/* Todo: Need to confirm whether this required cta */}
            <ScImage field={pageFields.Image} className="h-[672px] w-[560px] object-cover" />
            {/* <a href={URL?.value.href}>
                <img
                  src={Image.value?.src}
                  alt={`${Title.value} IMG`}
                  
                />
              </a> */}
          </div>
        </div>
      </div>
      // </FadeInUp>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default HappeningsTemplate;
