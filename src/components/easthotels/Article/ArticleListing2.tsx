import React, { useRef, JSX } from 'react';

import { useScroll } from 'framer-motion';
import ListingCard from 'components/easthotels/Article/ListingCard';
import FadeInUp from 'components/easthotels/Animation/FadeInUp';
import { Article2Prop, SelectedArticle } from '@/props/PageContent/Article2Prop';
import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import ComponentError from '../Error/ComponentError';

const FadeInCard = ({ selectedArticle }: { selectedArticle: SelectedArticle }) => {
  try {
    const target = useRef(null);
    const { scrollYProgress } = useScroll({
      target,
      offset: ['start end', 'end end'],
    });
    const { t, locale } = useI18n();

    const constructedUrl = {
      URL: selectedArticle.url,
      Text: t(DICTIONARY_CONSTANT.GENERAL.ARTICLE_LISTING_2_LINK_TEXT),
    };

    return (
      <div ref={target} className="lg:w-[590px]">
        <FadeInUp scrollYProgress={scrollYProgress}>
          <ListingCard articleCard={selectedArticle.fields} cta={constructedUrl} />
        </FadeInUp>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export const Default = (article2Prop: Article2Prop): JSX.Element => {
  try {
    const sitecoreCss = article2Prop.params?.Styles ?? '';
    return (
      <div className={`small-section-container ${sitecoreCss}`}>
        <div className="flex flex-wrap justify-center gap-x-[40px] gap-y-[60px] lg:gap-y-[100px]">
          {article2Prop.fields.SelectedArticles.map((article, index) => (
            <div key={index} className="mx-[15px] lg:max-w-[50%]">
              <FadeInCard selectedArticle={article} />
            </div>
          ))}
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

// Note: Article listing2 template
// datasource: query:../..//*[@@templateid='{3EE48932-AADB-47E0-9402-1E75C49099A8}']
