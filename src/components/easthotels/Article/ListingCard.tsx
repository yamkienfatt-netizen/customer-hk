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
import { _ArticleTagFields } from '@/props/Core/PageProps';
import ComponentError from '../Error/ComponentError';
import { HtmlLink } from '../CustomTypes/Components/HtmlLink';
import { cn } from 'lib/utils';
import { SitecoreLink } from '../CustomTypes/Components/SitecoreLink';

/*
  This component is being used by article listing and also header mega menu listing.
  Any changes to this common component will require testing in both article listing and header
*/

const ListingCard = ({
  articleCard,
  articleTag,
  cta,
  className,
  imgClassName,
  customCTABtn,
  imageClipOverEffect = true,
  isCarouselBanner4 = false,
  closeMenu = () => { },
  srcSet,
  sizes,
}: {
  articleCard: _ArticleCard;
  articleTag: _ArticleTagFields;
  cta?: { URL: LinkField | string; Text: TextField; URL2?: LinkField | string; Text2?: TextField };
  customCTABtn?: ReactNode;
  imageClipOverEffect?: boolean;
  isCarouselBanner4?: boolean;
  closeMenu?: () => void;
  srcSet?: any[];
  sizes?: string;
}) => {
  try {
    const LinkWrapper = ({
      cta,
      children,
    }: {
      cta?: {
        URL: LinkField | string;
        Text: TextField;
        URL2?: LinkField | string;
        Text2?: TextField;
      };
      children?: React.ReactNode;
    }) => {
      let url: LinkField | string | undefined;
      if (cta?.URL && cta?.Text) {
        url = cta.URL;
      } else if (cta?.URL2 && cta?.Text2) {
        url = cta.URL2;
      }
      return typeof url === 'string' ? (
        <HtmlLink href={url}>{children}</HtmlLink>
      ) : url?.value?.href ? (
        <SitecoreLink field={url}>{children}</SitecoreLink>
      ) : (
        <>{children}</>
      );
    };
    const localeUrl = typeof cta?.URL === 'string' ? cta?.URL : cta?.URL.value.href!;

    const { sitecoreContext } = useSitecoreContext();
    const isPageEditing = sitecoreContext.pageState === LayoutServicePageState.Edit;
    // const imageWidth =
    //   articleCard.Image.value?.width?.toString() < '320'
    //     ? articleCard.Image.value?.width?.toString()
    //     : '320';
    return (
      //style={{ maxWidth: `${imageWidth}px` }}
      <div className={cn(className)}>
        {(articleCard?.Legend?.value ||
          articleCard?.Legend2?.value ||
          articleTag?.Title?.value ||
          isPageEditing) && (
            <div className="mb-[25px] flex gap-[3px]">
              {(articleCard.Legend || isPageEditing) && (
                <Typography variant="l3" fontWeight="bold">
                  <ScText field={articleCard.Legend} />
                </Typography>
              )}
              {(articleCard.Legend2 || isPageEditing) && (
                <Typography variant="l3" fontWeight="semiBold">
                  <ScText field={articleCard.Legend2} />
                </Typography>
              )}
              {(articleTag?.Title || isPageEditing) && (
                <Typography variant="l3" fontWeight="bold">
                  <ScText field={articleTag?.Title} />
                </Typography>
              )}
            </div>
          )}

        {/* <ImageClipOnHover
            src={articleCard.Image.value?.src?.toString()!}
            alt={`${articleCard.Title?.value?.toString() ? articleCard.Title.value?.toString() : ''} IMG`}
            className={imgClassName}
          /> */}

        {isPageEditing ? (
          <ScImage field={articleCard.Image} srcSet={srcSet} sizes={sizes} />
        ) : (
          <LinkWrapper cta={cta}>
            {imageClipOverEffect ? (
              <ScImage
                field={articleCard.Image}
                alt={`${articleCard.Title?.value?.toString() ? articleCard.Title?.value?.toString() : ''} IMG`}
                className={cn('', imgClassName)}
                srcSet={srcSet}
                sizes={sizes}
              />
            ) : (
              <ScImage
                field={articleCard.Image}
                alt={`${articleCard.Title?.value?.toString() ? articleCard.Title?.value?.toString() : ''} IMG`}
                className={cn('', imgClassName)}
                srcSet={srcSet}
                sizes={sizes}
              />
            )}
          </LinkWrapper>
        )}

        <LinkWrapper cta={cta}>
          {(articleCard.Title || isPageEditing) && (
            // <HtmlLink href={localeUrl}>
            <div className="mt-[20px]">
              <Typography variant="h4">
                <ScText field={articleCard.Title} />
              </Typography>
            </div>
            // </HtmlLink>
          )}
          {(articleCard.SubTitle?.value || isPageEditing) && (
            <div className="mb-[20px] mt-[10px] lg:mb-[25px]">
              <Typography variant="p">
                <ScText field={articleCard.SubTitle} />
              </Typography>
            </div>
          )}
          {(articleCard?.Date?.value || articleCard?.Time?.value || articleCard?.Location?.value) && (
            <div className="mb-[25px]">
              {articleCard.Date && articleCard.Time && (
                <>
                  <Typography variant="p" extraStyles="lg:hidden">
                    {articleCard.Date.value + ' | ' + articleCard.Time.value}
                  </Typography>
                  <Typography variant="p" extraStyles="hidden lg:block">
                    <ScText field={articleCard.Date} />
                  </Typography>
                  <Typography variant="p" extraStyles="hidden lg:block">
                    <ScText field={articleCard.Time} />
                  </Typography>
                </>
              )}
              {(articleCard.Location || isPageEditing) && (
                <div>
                  <Typography variant="p">
                    <ScText field={articleCard.Location} />
                  </Typography>
                </div>
              )}
            </div>
          )}
        </LinkWrapper>

        {(articleCard.Description || isPageEditing) && (
          <div className={`${isCarouselBanner4 ? 'mb-[25px] mt-[10px]' : 'my-[25px]'}`}>
            <Typography variant="p">
              <ScText field={articleCard.Description} />
            </Typography>
          </div>
        )}

        {customCTABtn ? (
          <>{customCTABtn}</>
        ) : (
          cta && (
            <div className="flex gap-[20px]" onClick={() => closeMenu && closeMenu()}>
              {cta?.URL && cta?.Text && (
                <CTAButton url={cta?.URL} text={cta?.Text} variant="underlined" />
              )}

              {cta?.URL2 && cta?.Text2 && (
                <CTAButton url={cta?.URL2} text={cta?.Text2} variant="underlined" />
              )}
            </div>
          )
        )}

        {articleCard.Buttons && (
          <div className="flex gap-[20px]" onClick={() => closeMenu && closeMenu()}>
            {articleCard.Buttons.map((button, index) => {
              if (button.type == 'cta') {
                return <CTAButton url={button?.url} text={button?.text} variant="underlined" />;
              }
            })}
          </div>
        )}
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default ListingCard;
