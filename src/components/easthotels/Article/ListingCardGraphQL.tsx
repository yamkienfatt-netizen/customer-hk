import { ReactNode } from 'react';
import Typography from '../Typography/Typography';
import CTAButton from '../Button/CTAButton';
import {
  Text as ScText,
  Image as ScImage,
  useSitecoreContext,
  LayoutServicePageState,
  LinkField,
  TextField,
} from '@sitecore-jss/sitecore-jss-nextjs';
import ImageClipOnHover from '../Animation/ImageClipOnHover';
import { _ArticleCard, _ArticleCardGraphQL } from '@/props/common/_ArticleCard';
import {
  _ArticleTagFields,
  _SimplePageFields,
  _SimplePageGraphQLFields,
} from '@/props/Core/PageProps';
import { _StayDetailGraphQL } from '@/props/common/_StayDetail';
import config from 'temp/config';
import ComponentError from '../Error/ComponentError';
import { HtmlLink } from '../CustomTypes/Components/HtmlLink';

const ListingCardGraphQL = ({
  articleCard,
  articleTag,
  cta,
  className,
  imgClassName,
  isStay = false,
  isMultipleUrl = false,
  imageClipOverEffect = true,
}: {
  articleCard: _ArticleCardGraphQL | _StayDetailGraphQL | _SimplePageGraphQLFields;
  articleTag: _ArticleTagFields;
  cta?: {
    URL: LinkField | string;
    Text: TextField | string;
    URL2?: LinkField | string;
    Text2?: TextField | string;
  };
  className?: string;
  imgClassName?: string;
  isStay?: boolean;
  isMultipleUrl?: boolean;
  imageClipOverEffect?: boolean;
}) => {
  try {
    const articleCardImage = isStay
      ? (articleCard as _StayDetailGraphQL).roomListingImage
      : articleCard.image;

    const imageWidth = articleCardImage?.value?.width?.toString()
      ? articleCardImage?.value?.width?.toString()
      : '400';

    return (
      <div
        style={{ maxWidth: `${imageWidth}px` }}
        className={`${className} max-[450px]:!max-w-[250px]`}
      >
        <div className="mb-[25px] flex gap-[3px]">
          {articleCard.legend && (
            <Typography variant="l3" fontWeight="bold">
              <ScText field={articleCard.legend} />
            </Typography>
          )}
          {articleCard.legend2 && (
            <Typography variant="l3" fontWeight="semiBold">
              <ScText field={articleCard.legend2} />
            </Typography>
          )}
          {articleTag?.Title && (
            <Typography variant="l3" fontWeight="bold">
              <ScText field={articleTag?.Title} />
            </Typography>
          )}
        </div>
        <HtmlLink href={cta?.URL as string}>
          {imageClipOverEffect ? (
            <ImageClipOnHover
              src={articleCardImage?.jsonValue.value.src}
              alt={`${articleCard.title?.value?.toString() ? articleCard.title.value?.toString() : ''} IMG`}
              className={imgClassName}
            />
          ) : (
            <ScImage
              field={articleCardImage?.jsonValue}
              alt={`${articleCard.title?.value?.toString() ? articleCard.title.value?.toString() : ''} IMG`}
              className={imgClassName}
            />
          )}
        </HtmlLink>
        {articleCard.title && (
          <HtmlLink href={cta?.URL as string}>
            <div className="mt-[20px]">
              <Typography variant="h4">
                <ScText field={articleCard.title} />
              </Typography>
            </div>
          </HtmlLink>
        )}
        {articleCard.subTitle && (
          <div className="mb-[20px] mt-[10px] lg:mb-[25px]">
            <Typography variant="p">
              <ScText field={articleCard.subTitle} />
            </Typography>
          </div>
        )}
        <div className="mb-[25px]">
          {articleCard.location && (
            <div>
              <Typography variant="p">
                <ScText field={articleCard.location} />
              </Typography>
            </div>
          )}
        </div>

        {articleCard.description && (
          <div className="my-[25px]">
            <Typography variant="p">
              <ScText field={articleCard.description} />
            </Typography>
          </div>
        )}

        <div className="flex gap-[20px]">
          <CTAButton url={cta?.URL} text={cta?.Text as string} variant="underlined" />

          {isMultipleUrl && (
            <CTAButton url={cta?.URL2} text={cta?.Text2 as string} variant="underlined" />
          )}
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default ListingCardGraphQL;
