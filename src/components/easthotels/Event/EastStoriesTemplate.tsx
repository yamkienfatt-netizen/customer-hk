import React from 'react';
import FadeInUp from 'components/easthotels/Animation/FadeInUp';
import Typography from 'components/easthotels/Typography/Typography';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import ShareButtions from 'components/easthotels/Social/ShareButtons';
import RichTextTypography from 'components/easthotels/Typography/RichTextTypography';
import {
  LayoutServicePageState,
  Text as ScText,
  Image as ScImage,
  RichText as ScRichText,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { PageRouteFields } from '@/props/Core/PageProps';
import { EastStoriesDetailProps } from '@/props/Core/EastStoriesDetailProps';
import ComponentError from '../Error/ComponentError';

const EastStoriesTemplate = () => {
  try {
    const context = useSitecoreContext();
    const { route } = context.sitecoreContext;
    const pageFields = route?.fields as PageRouteFields & EastStoriesDetailProps;
    const isPageEditing = context.sitecoreContext.pageState === LayoutServicePageState.Edit;

    const isPortraitImage =
      Number(pageFields?.Image?.value?.height) >= Number(pageFields?.Image?.value?.width);

    return (
      <FadeInUp>
        <div className="mx-[15px] lg:mx-[50px]">
          <div
            // className={`lg:small-section-container mx-auto mt-[30px] max-w-[374px] lg:max-w-[1280px]`}
            className="small-section-container grid justify-between gap-[20px] lg:grid-cols-2 lg:gap-[40px]"
          >
            <div className={`lg:hidden`}>
              {/* Todo: Check whether east stories required a CTA */}
              {/* <a href={cta?.url}>
                  <img src={image} alt={`${title} IMG`} className="h-full w-full" />
                </a> */}
              {isPortraitImage ? (
                <ScImage field={pageFields.Image} className="aspect-square w-full object-cover" />
              ) : (
                <ScImage field={pageFields.Image} className="w-full object-contain" />
              )}
            </div>
            {/* max-w-[590px]  */}
            <div className="lg:mt-[60px] lg:flex-1">
              {pageFields.ArticleTag?.fields.Title?.value && (
                <div className={'lg:mb-[40px]'}>
                  <Typography variant="l3" fontWeight="bold" fontColor="#A8ADA1">
                    {pageFields.ArticleTag?.fields.Title?.value}
                  </Typography>
                </div>
              )}
              {(isPageEditing || pageFields.Title) && (
                <div className={'mb-[30px] mt-[20px] lg:mb-[40px]'}>
                  <Typography variant="h2" font="Bellefair">
                    <ScText field={pageFields.Title} />
                  </Typography>
                </div>
              )}
              <div className={'mb-[30px] lg:mb-[60px]'}>
                <ShareButtions />
              </div>
              {(isPageEditing || pageFields.Content) && (
                <div className="mb-[30px] lg:mb-[50px]">
                  <RichTextTypography>
                    <ScRichText field={pageFields.Content} />
                  </RichTextTypography>
                </div>
              )}
            </div>
            <div
              className={`relative hidden overflow-visible lg:sticky lg:top-[75px] lg:flex  lg:w-full lg:items-center lg:justify-end`}
            >
              {/* <a href={cta.url}>
                  <ScImage field={pageFields.Image} />
                </a> */}
              {isPortraitImage ? (
                <ScImage field={pageFields.Image} className="aspect-square w-full object-cover" />
              ) : (
                <ScImage field={pageFields.Image} className="w-full object-contain" />
              )}
            </div>
          </div>
        </div>
      </FadeInUp>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default EastStoriesTemplate;
