import React, { useState, JSX } from 'react';
import Typography from 'components/easthotels/Typography/Typography';
import FadeInUp from 'components/easthotels/Animation/FadeInUp';
import { Article1DetailPage, Article1ListingProps } from '@/props/PageContent/ArticleListing1Props';
import {
  Image as ScImage,
  Text as ScText,
  RichText as ScRichText,
  withDatasourceCheck,
  TextField,
  useSitecoreContext,
  LayoutServicePageState,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { HtmlLink } from '../CustomTypes/Components/HtmlLink';
import CTAButton from 'components/easthotels/Button/CTAButton';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import { useI18n } from 'next-localization';
import CatFilter from '../CustomTypes/Components/CatFilter';
import { _PageMetadata } from '@/props/common/_PageMetadata';
import { PageRouteFields, _ArticleTagFields } from '@/props/Core/PageProps';
import ComponentError from '../Error/ComponentError';

// Component element:
// 1) thumbnail, title, blurb, CTA text, CTA link
// *tag text, select tag will be done by backend interface

const Article1ListingCard = ({
  article1DetailPage,
  articleCTALabel,
}: {
  article1DetailPage: Article1DetailPage;
  articleCTALabel: TextField;
}): JSX.Element => {
  try {
    const { sitecoreContext } = useSitecoreContext();

    const isPageEditing = sitecoreContext.pageState === LayoutServicePageState.Edit;

    console.log('article1DetailPage.fields.Title', article1DetailPage.fields.Title);
    return (
      <FadeInUp>
        <div
          className={`small-section-container_70-margin !my-[60px] flex flex-col items-center lg:!my-[100px] lg:flex-row lg:gap-[40px]`}
        >
          <div className={`aspect-[590/350] max-w-full flex-1 lg:max-w-[590px]`}>
            <HtmlLink href={article1DetailPage.url}>
              <ScImage
                field={article1DetailPage.fields.Image}
                className={'h-full w-full object-cover'}
              />
            </HtmlLink>
          </div>
          <div className="max-w-[590px] flex-1">
            {(isPageEditing || article1DetailPage.fields.ArticleTag) && (
              <div className="mb-[10px] mt-[15px] lg:mb-[20px] lg:mt-[10px]">
                <Typography variant="l3" fontWeight="bold" extraStyles="opacity-[50%]">
                  <ScText field={article1DetailPage.fields.ArticleTag.fields.Title} />
                </Typography>
              </div>
            )}
            {(isPageEditing || article1DetailPage.fields.Title) && (
              <HtmlLink href={article1DetailPage.url}>
                <div className="mb-[20px] lg:mb-[80px]">
                  <Typography variant="h2" font="Bellefair">
                    <ScText field={article1DetailPage.fields.Title} />
                  </Typography>
                </div>
              </HtmlLink>
            )}

            {(isPageEditing || article1DetailPage.fields.Description) && (
              <div className="my-[25px] lg:my-[30px]">
                <Typography variant="p">
                  <ScText field={article1DetailPage.fields.Description} />
                </Typography>
              </div>
            )}

            <CTAButton
              url={article1DetailPage.url as string}
              text={articleCTALabel as TextField}
              variant="underlined"
            />
          </div>
        </div>
      </FadeInUp>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

const ArticleListing1 = (article1ListingProps: Article1ListingProps): JSX.Element => {
  try {
    const sitecoreCss = article1ListingProps.params?.Styles ?? '';
    const FILTER_TEXT: string[] = [];
    const { t } = useI18n();

    const viewAllFilteringLabel = t(
      DICTIONARY_CONSTANT.GENERAL.ARTICLE_LISTING_3_FILTERING_VIEW_ALL
    ); //default value: 'VIEW ALL'
    FILTER_TEXT.push(viewAllFilteringLabel);

    const context = useSitecoreContext();
    const { route } = context.sitecoreContext;
    const pageFields = route?.fields as PageRouteFields & _PageMetadata;

    const isPropertyPage = pageFields.IsPropertyPage.value;

    article1ListingProps.fields.SelectedArticles.map((article, index) => {
      article.fields.ArticleTag?.fields.Title?.value &&
        !FILTER_TEXT.includes(article.fields.ArticleTag?.fields.Title?.value) &&
        FILTER_TEXT.push(article.fields.ArticleTag?.fields.Title?.value);
    });
    const [selectedCat, setSelectedCat] = useState(viewAllFilteringLabel); //default value: 'VIEW ALL'
    return (
      <div className={`lg:small-section-container ${sitecoreCss}  mx-[15px] lg:mx-[50px]`}>
        <div
          //lg:mb-[82px]
          className={`${isPropertyPage ? 'bg-property' : 'bg-brand'} sticky top-[73px] z-10 mb-[0px] mt-[23px] flex justify-center bg-opacity-90 py-[15px] backdrop-blur-xl lg:relative lg:top-0 lg:mb-0 lg:mt-[57px] lg:bg-opacity-100`}
        >
          <CatFilter
            cats={FILTER_TEXT}
            selectedCat={selectedCat}
            onClickCat={(cat) => setSelectedCat(cat)}
          />
        </div>
        {/* {article1ListingProps.fields.SelectedArticles &&
          article1ListingProps.fields.SelectedArticles.map((article, index) => (
            <Article1ListingCard
              key={index}
              article1DetailPage={article}
              articleCTALabel={article1ListingProps.fields.ArticleCTALabel}
            />
          ))} */}

        {article1ListingProps.fields.SelectedArticles.map((article, index) => {
          if (
            article.fields.ArticleTag?.fields.Title?.value == selectedCat ||
            selectedCat == viewAllFilteringLabel
          ) {
            return (
              <div key={index}>
                <Article1ListingCard
                  article1DetailPage={article}
                  articleCTALabel={article1ListingProps.fields.ArticleCTALabel}
                />
              </div>
            );
          }
        })}
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default withDatasourceCheck()<Article1ListingProps>(ArticleListing1);
