import React, { JSX } from 'react';
import Typography from 'components/easthotels/Typography/Typography';
import ShareButtions from 'components/easthotels/Social/ShareButtons';
import RichTextTypography from 'components/easthotels/Typography/RichTextTypography';
import FadeInUp from 'components/easthotels/Animation/FadeInUp';
import {
  Placeholder as ScPlaceholder,
  Image as ScImage,
  RichText as ScRichText,
  Text as ScText,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs';
import {
  ArticleDetail1PageProps,
  PageRouteFields,
  _ArticleTagFields,
} from '@/props/Core/PageProps';
import { _ArticleCard } from '@/props/common/_ArticleCard';
import { _Image } from '@/props/common/_Image';
import { _Offer } from '@/props/common/_Offer';
import ComponentError from '../Error/ComponentError';

export const Default = (articleDetail1PageProps: ArticleDetail1PageProps): JSX.Element => {
  try {
    const context = useSitecoreContext();
    const { route } = context.sitecoreContext;
    const pageFields = route?.fields as PageRouteFields &
      _Image &
      _Offer &
      _ArticleCard & {
        ArticleTag: {
          fields: _ArticleTagFields;
        };
      };

    const articleDetail1LeftPlaceholderKey = `articledetail1-left`;
    const articleDetail1ContentPlaceholderKey = `articledetail1-content`;
    const sitecoreCss = articleDetail1PageProps.params?.Styles ?? '';
    return (
      <div className={`medium-section-container_1440 ${sitecoreCss}`}>
        {/* left column */}
        <div className="flex flex-col lg:flex-row lg:space-x-[30px]">
          {/* lg:mx-[15px] */}
          <div className="hidden h-fit lg:sticky lg:top-[140px] lg:ml-[30px] lg:mr-0 lg:mt-[140px] lg:block lg:w-[33%]">
            <div className="mb-[40px]">
              <Typography variant="l3" fontWeight="bold" extraStyles="opacity-[50%]">
                <ScText field={pageFields?.ArticleTag?.fields.Title} />
              </Typography>

              {pageFields?.IsMemberExclusive.value && (
                <>{/* Todo: Aman to create a label here display member exclusive text */}</>
              )}
            </div>
            <div className="mb-[40px]">
              <Typography variant="h2" font="Bellefair">
                <ScText field={pageFields?.Title} />
              </Typography>
            </div>
            <div className="article-detail-cta w-full">
              <ScPlaceholder
                name={articleDetail1LeftPlaceholderKey}
                rendering={articleDetail1PageProps.rendering}
              />
            </div>
            {/* Todo: need to convert as separate component */}
            <div className="mt-[40px]">
              <ShareButtions />
            </div>
          </div>
          {/* right column */}
          <div className="order-first w-full lg:order-last">
            <ScImage field={pageFields?.Image} className={'aspect-[1.8] w-full object-cover'} />
            <div className="mx-[15px] lg:ml-0 lg:mr-[30px]">
              <div className="lg:hidden ">
                <div className="mb-[20px] mt-[30px]">
                  <Typography variant="l3" fontWeight="bold" extraStyles="opacity-[50%]">
                    <ScText field={pageFields?.ArticleTag?.fields.Title} />
                  </Typography>
                </div>
                <div className="mb-[20px]">
                  <Typography variant="h2" font="Bellefair">
                    <ScText field={pageFields?.Title} />
                  </Typography>
                </div>
                <div className="article-detail-cta w-full">
                  <ScPlaceholder
                    name={articleDetail1LeftPlaceholderKey}
                    rendering={articleDetail1PageProps.rendering}
                  />
                </div>
                <div className="mt-[30px]">
                  <ShareButtions />
                </div>
              </div>
              <div className="mb-[60px] mt-[44px]">
                {/* <FadeInUp> */}
                <RichTextTypography>
                  <ScRichText field={pageFields?.Content} />
                </RichTextTypography>
                {/* </FadeInUp> */}
              </div>
              <div className="tnc-editor">
                <ScPlaceholder
                  name={articleDetail1ContentPlaceholderKey}
                  rendering={articleDetail1PageProps.rendering}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};
