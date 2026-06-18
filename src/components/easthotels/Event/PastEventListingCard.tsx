import Typography from '../Typography/Typography';
import CTAButton from '../Button/CTAButton';
import Image from 'next/image';
import FadeInUp from '../Animation/FadeInUp';
import RichTextTypography from '../Typography/RichTextTypography';
import { _ArticleCard, _ArticleCardGraphQL } from '@/props/common/_ArticleCard';
import {
  Text as ScText,
  RichText as ScRichText,
  Image as ScImage,
  useSitecoreContext,
  LayoutServicePageState,
  ImageFieldValue,
  ImageField,
} from '@sitecore-jss/sitecore-jss-nextjs';
import config from 'temp/config';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import { useI18n } from 'next-localization';
import { ItwutEventDetailsField } from '@/props/Graphql/ItwutEventDetailsQueryProps';
import ComponentError from '../Error/ComponentError';
import { HtmlLink } from '../CustomTypes/Components/HtmlLink';

const PastEventListingCard = ({
  articleCard,
  imageOnLeft,
  cardStyle,
}: {
  articleCard: ItwutEventDetailsField;
  imageOnLeft: boolean;
  cardStyle?: string;
}) => {
  try {
    const { t } = useI18n();
    const { sitecoreContext } = useSitecoreContext();
    const isPageEditing =
      sitecoreContext.pageState === LayoutServicePageState.Edit ||
      sitecoreContext.pageState === LayoutServicePageState.Preview;

    const gridClass = imageOnLeft ? 'lg:order-last' : '';
    const justifyItemsClass = imageOnLeft ? 'lg:justify-items-start' : 'lg:justify-items-end';

    if (isPageEditing) {
      var urlSrc = articleCard.image.jsonValue?.value?.src;
      if (urlSrc) {
        var imageUrl = new URL(urlSrc);
        articleCard.image.jsonValue.value.src = `${config.sitecoreApiHost}${imageUrl.pathname}${imageUrl.search}`;
      }
    }

    return (
      // <FadeInUp> mx-[15px] max-w-[345px]
      <div className={`my-[30px] w-full lg:mx-auto lg:max-w-[975px] ${cardStyle || ''}`}>
        <div className={`grid ${justifyItemsClass} w-full lg:grid-cols-3`}>
          <div
            //aspect-[334.62/402.12] w-[334px] max-w-[345px]
            className={`${gridClass} aspect-[0.8] w-full  lg:col-span-1`}
          >
            {isPageEditing ? (
              <ScImage
                field={articleCard.image.jsonValue as ImageField}
                className="h-full w-full object-cover lg:max-w-none"
              />
            ) : (
              // <a href={articleCard.url.url}>
              <HtmlLink href={articleCard.url.path}>
                <ScImage
                  field={articleCard.image.jsonValue as ImageField}
                  className="h-full w-full object-cover lg:max-w-none"
                />
              </HtmlLink>
            )}
          </div>
          {/* lg:w-[590px] */}
          <div className="lg:col-span-2 lg:w-[590px]">
            <div className="mt-[20px] flex justify-between lg:mt-[30px]">
              {(isPageEditing || articleCard.legend) && (
                <Typography variant="l3" fontWeight="bold" extraStyles="opacity-[50%]">
                  <ScText field={articleCard.legend} />
                </Typography>
              )}
              {(isPageEditing || articleCard.legend2) && (
                <Typography variant="l3" fontWeight="bold" extraStyles="opacity-[50%]">
                  <ScText field={articleCard.legend2} />
                </Typography>
              )}
            </div>
            {(isPageEditing || articleCard.title) && (
              <>
                <HtmlLink href={articleCard.url.path}>
                  <div className="mb-[15px] mt-[20px] lg:mt-[30px]">
                    <Typography variant="h2" font="Bellefair" className="break-all lg:break-normal">
                      <ScText field={articleCard.title} />
                    </Typography>
                  </div>
                </HtmlLink>
              </>
            )}
            {(isPageEditing || articleCard.subTitle) && (
              <Typography variant="p">
                <ScText field={articleCard.subTitle} />
              </Typography>
            )}
            {(isPageEditing || articleCard.description) && (
              <div className="my-[30px]">
                <RichTextTypography>
                  <ScText field={articleCard.description} />
                </RichTextTypography>
              </div>
            )}
            <CTAButton
              url={articleCard.url.path as string}
              text={t(DICTIONARY_CONSTANT.CTA.PASTEVENTLISTING_MOREDETAIL)}
              variant="underlined"
            />
          </div>
        </div>
      </div>
      // </FadeInUp>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default PastEventListingCard;
