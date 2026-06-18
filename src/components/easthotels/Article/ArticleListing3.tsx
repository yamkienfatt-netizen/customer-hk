import React, { useRef, useState } from 'react';
import CatFilter from 'components/easthotels/CustomTypes/Components/CatFilter';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import { useScroll } from 'framer-motion';
import { useI18n } from 'next-localization';
import ListingCard from 'components/easthotels/Article/ListingCard';
import { SelectedArticle } from '@/props/PageContent/Article2Prop';
import FadeInUp from 'components/easthotels/Animation/FadeInUp';
import { TextField, withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import { ArticleListing3Props } from '@/props/media/ArticleListing3Props';
import { _ArticleTagFields } from '@/props/Core/PageProps';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import ComponentError from '../Error/ComponentError';

const FadeInCard = ({
  selectedArticle,
  articleTag,
  articleCTALabel,
}: {
  selectedArticle: SelectedArticle;
  articleTag: _ArticleTagFields;
  articleCTALabel: TextField;
}) => {
  try {
    const target = useRef(null);
    const { scrollYProgress } = useScroll({
      target,
      offset: ['start end', 'end end'],
    });

    const constructedUrl = {
      URL: selectedArticle.url,
      Text: articleCTALabel,
    };

    return (
      <div ref={target} className="lg:w-[386px]">
        <FadeInUp scrollYProgress={scrollYProgress}>
          <ListingCard
            articleCard={selectedArticle.fields}
            articleTag={articleTag}
            cta={constructedUrl}
          />
        </FadeInUp>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />
  }
};

const Default = (articleListing3Props: ArticleListing3Props) => {
  try {
    const FILTER_TEXT: string[] = [];
    const { t } = useI18n();
    const viewAllFilteringLabel = t(DICTIONARY_CONSTANT.GENERAL.ARTICLE_LISTING_3_FILTERING_VIEW_ALL); //default value: 'VIEW ALL'
    FILTER_TEXT.push(viewAllFilteringLabel);

    const [selectedCat, setSelectedCat] = useState(viewAllFilteringLabel); //default value: 'VIEW ALL'
    articleListing3Props.fields.SelectedArticles.map((article, index) => {
      article.fields.ArticleTag?.fields.Title?.value &&
        !FILTER_TEXT.includes(article.fields.ArticleTag?.fields.Title?.value) &&
        FILTER_TEXT.push(article.fields.ArticleTag?.fields.Title?.value);
    });
    const sitecoreCss = articleListing3Props.params?.Styles ?? '';
    // Todo add a flag from sitecore for mobile bg color
    const IsPropertyPage = false;
    return (
      <div className={'medium-section-container px-[15px] lg:px-[30px] ' + sitecoreCss}>
        <div
          className={`${IsPropertyPage ? 'bg-property' : 'bg-brand'} sticky top-[75px] z-10 mb-[60px] mt-[23px] flex justify-center bg-opacity-90 py-[15px] backdrop-blur-xl lg:relative lg:top-0 lg:mb-[82px] lg:mt-[57px] lg:bg-opacity-100`}
        >
          <CatFilter
            cats={FILTER_TEXT}
            selectedCat={selectedCat}
            onClickCat={(cat) => setSelectedCat(cat)}
          />
        </div>
        <div className="mx-auto flex max-w-[1278px] flex-wrap justify-center gap-x-[30px] gap-y-[62px]">
          {articleListing3Props.fields.SelectedArticles.map((article, index) => {
            if (
              article.fields.ArticleTag?.fields.Title?.value == selectedCat ||
              selectedCat == viewAllFilteringLabel
            ) {
              return (
                <div key={index}>
                  <FadeInCard
                    selectedArticle={article}
                    articleTag={article.fields.ArticleTag?.fields}
                    articleCTALabel={articleListing3Props.fields.ArticleCTALabel}
                  />
                </div>
              );
            }
          })}
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />
  }
};

export default withDatasourceCheck()<ArticleListing3Props>(Default);
