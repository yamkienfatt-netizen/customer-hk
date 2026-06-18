import React from 'react';
import Typography from 'components/easthotels/Typography/Typography';
import RichTextTypography from 'components/easthotels/Typography/RichTextTypography';
import CTAButton from 'components/easthotels/Button/CTAButton';
import useWindowSize from 'src/hooks/useWindowSize';
import {
  withDatasourceCheck,
  Image as ScImage,
  Text as ScText,
  useSitecoreContext,
  LayoutServicePageState,
  TextField,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { OffersProps } from '@/props/Media/OffersProps';
import ComponentError from '../Error/ComponentError';

const Default = (offersProps: OffersProps) => {
  try {
    const { sitecoreContext } = useSitecoreContext();
    const isPageEditing = sitecoreContext.pageState === LayoutServicePageState.Edit;

    const totalArticle = offersProps.fields.SelectedArticles ? offersProps.fields.SelectedArticles.length : 0;

    const { isMobile } = useWindowSize();
    if (!offersProps.fields.SelectedArticles) {
      return null; // Return null if there are no selected articles
    }
    const withImage = offersProps.fields.WithImage.value;
    const sitecoreCss = offersProps.params?.Styles ?? '';

    return (
      <>
        {
          (!isPageEditing && totalArticle == 0) ? <></> : (
            <div className={`${'small-section-container mx-[15px] lg:mx-0' + sitecoreCss}`}>
              <div>
                <Typography variant="l3" fontWeight="bold" extraStyles="mb-[20px]">
                  <ScText field={offersProps.fields.Title} />
                </Typography>
              </div>
              <div
                className={`${withImage && isMobile ? 'border-b' : ''} ${withImage ? 'flex flex-nowrap gap-[30px] overflow-x-auto border-black-secondary scrollbar-hide lg:flex-col' : ''}`}
              >
                {offersProps.fields.SelectedArticles.map((offer, index) => {
                  return (
                    <>
                      <div
                        className={`${withImage && isMobile ? '' : 'border-b'} ${index !== 0 ? 'lg:mt-[30px]' : ''} flex flex-col border-black-secondary pb-[25px] lg:flex-row lg:gap-[20px]`}
                      >
                        {(isPageEditing || offer?.fields.Image?.value?.src) && (
                          <div className={`lg:1/2 mb-[20px] flex lg:mb-0`}>
                            <ScImage field={offer?.fields.Image} className="h-full w-full" />
                          </div>
                        )}
                        <div className={`flex flex-wrap lg:w-1/2`}>
                          <div
                            className="flex flex-col flex-wrap"
                            style={{ width: Number(offer?.fields.Image?.value?.width) }}
                          >
                            <Typography variant="h4" extraStyles={'mb-[15px] mt-[5px]'}>
                              <ScText field={offer.fields.Title} />
                            </Typography>
                            <RichTextTypography>
                              <ScText field={offer.fields.Description} />
                            </RichTextTypography>
                            <CTAButton
                              text={offersProps.fields.CTAText as TextField}
                              url={offer.url}
                              extraContainerStyles="mt-[25px]"
                              variant="underlined"
                            ></CTAButton>
                          </div>
                        </div>
                      </div>
                      {!withImage && <div className="mb-[25px]" />}
                    </>
                  );
                })}

                {
                  (isPageEditing && totalArticle == 0) && (<p>Warning: No article selected. The component will be hidden</p>)
                }
              </div>
            </div>
          )
        }
      </>
    );
  } catch (err) {
    return <ComponentError error={err} />
  }
};

export default withDatasourceCheck()<OffersProps>(Default);
