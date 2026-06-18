import React from 'react';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import Typography from 'components/easthotels/Typography/Typography';
import RichTextTypography from 'components/easthotels/Typography/RichTextTypography';
import { ComponentProps } from 'lib/component-props';
import {
  Placeholder as ScPlaceholder,
  useSitecoreContext,
  Text as ScText,
  RichText as ScRichText,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { PageRouteFields, _SimplePageFields } from '@/props/Core/PageProps';
import { _RestaurantBar } from '@/props/common/_RestaurantBar';
import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import ComponentError from '../Error/ComponentError';

const SideMenu = ({
  componentProps,
  pageFields,
}: {
  componentProps: ComponentProps;
  pageFields: PageRouteFields & _SimplePageFields & _RestaurantBar;
}) => {
  try {
    const rbTemplateSideMenuPlaceholderKey = `rbtemplatesidemenu`;
    const { t } = useI18n();

    return (
      <>
        <div className="min-[392px]:flex min-[392px]:gap-[60px] lg:block lg:gap-0">
          <div>
            <Typography variant="l1" fontWeight="bold" extraStyles="mb-[10px]">
              {t(DICTIONARY_CONSTANT.RESTAURANT_AND_BAR.OPENING_HOUR)}
            </Typography>
            <RichTextTypography>
              <ScRichText field={pageFields.OpeningHours} />
            </RichTextTypography>
          </div>
          <div className="mt-[25px] min-[392px]:mt-0">
            <Typography variant="l1" fontWeight="bold" extraStyles="lg:mt-[25px] mb-[10px]">
              {t(DICTIONARY_CONSTANT.RESTAURANT_AND_BAR.LOCATION)}
            </Typography>
            <RichTextTypography>
              <ScRichText field={pageFields.Location} />
            </RichTextTypography>
          </div>
        </div>
        <Typography variant="l1" fontWeight="bold" extraStyles="mt-[25px] mb-[10px]">
          {t(DICTIONARY_CONSTANT.RESTAURANT_AND_BAR.CONTACT)}
        </Typography>
        <div className="mb-[30px]">
          {/* <RichTextTypography>
            <ScRichText field={pageFields.ContactEmail} />
          </RichTextTypography> */}
          <Typography variant="p">
            <div className={`richtext with-arrow `}>
              <ScRichText field={pageFields.ContactEmail} />
            </div>
          </Typography>
        </div>
        <ScPlaceholder
          name={rbTemplateSideMenuPlaceholderKey}
          rendering={componentProps.rendering}
        />
      </>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

const RBTemplate = (componentProps: ComponentProps) => {
  try {
    const context = useSitecoreContext();
    const { route } = context.sitecoreContext;
    const pageFields = route?.fields as PageRouteFields & _SimplePageFields & _RestaurantBar;

    const rbTemplatePlaceholderKey = `rbtemplate`;
    const sitecoreCss = componentProps.params?.Styles ?? '';
    return (
      <div className={'full-width-section-container relative  ' + sitecoreCss}>
        <div className="flex flex-col justify-center px-[15px] lg:flex-row lg:px-[30px]">
          <div className="sticky top-[77px] mr-[129px] hidden h-fit max-w-[300px] pt-[70px] lg:block">
            <SideMenu componentProps={componentProps} pageFields={pageFields}></SideMenu>
          </div>

          <div className="mt-[39px] lg:mt-[60px] lg:max-w-[800px]">
            <Typography variant="inner-h1" font="Bellefair" extraStyles=" mb-[30px] lg:mb-[40px]">
              <ScText field={pageFields.Title} />
            </Typography>
            <div className="mb-[60px] lg:hidden">
              <SideMenu componentProps={componentProps} pageFields={pageFields}></SideMenu>
            </div>
            <RichTextTypography className='lg:max-w-[630px]'>
              <ScRichText field={pageFields.Content} />
            </RichTextTypography>
            <div className="mb-[40px]" />

            <div>
              {/* <Offers /> */}
              <ScPlaceholder name={rbTemplatePlaceholderKey} rendering={componentProps.rendering} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default RBTemplate;
