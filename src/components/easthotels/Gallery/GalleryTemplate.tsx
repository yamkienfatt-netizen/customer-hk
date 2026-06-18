import React, { useState } from 'react';
import CatFilter from 'components/easthotels/CustomTypes/Components/CatFilter';
import FadeInUp from 'components/easthotels/Animation/FadeInUp';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import ImageClipOnHover from 'components/easthotels/Animation/ImageClipOnHover';
import useWindowSize from 'src/hooks/useWindowSize';
import { GalleryLightbox } from './GalleryLightbox';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import { GalleryImageWithTag, GalleryTemplateProps } from '@/props/Media/GalleryTemplateProps';
import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import ComponentError from '../Error/ComponentError';
import { useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';
import { PageRouteFields } from '@/props/Core/PageProps';
import { _PageMetadata } from '@/props/common/_PageMetadata';

let galleryData: [][] = [];

const Default = (galleryTemplateProps: GalleryTemplateProps) => {
  try {
    const FILTER_TEXT: string[] = [];
    const { t } = useI18n();
    const viewAllFilteringLabel = t(
      DICTIONARY_CONSTANT.GENERAL.GALLERY_TEMPLATE_FILTERING_VIEW_ALL
    ); //default value: 'VIEW ALL'
    FILTER_TEXT.push(viewAllFilteringLabel);
    galleryTemplateProps.fields.SelectedImages.map((image, index) => {
      image.fields.Tag?.fields.Title?.value &&
        !FILTER_TEXT.includes(image.fields.Tag?.fields.Title?.value as string) &&
        FILTER_TEXT.push(image.fields.Tag?.fields.Title?.value as string);
    });

    const [selectedCat, setSelectedCat] = useState(viewAllFilteringLabel);
    const { isMobile } = useWindowSize();

    const numberOfColumns = isMobile ? 2 : 3;
    galleryData = isMobile ? [[], []] : [[], [], []];
    galleryTemplateProps.fields.SelectedImages.map((image, index) => {
      const r = index % numberOfColumns;
      galleryData[r].push(image);
    });
    const sitecoreCss = galleryTemplateProps.params?.Styles ?? '';

    const context = useSitecoreContext();
    const { route } = context.sitecoreContext;
    const pageFields = route?.fields as PageRouteFields & _PageMetadata;

    return (
      <div className={'medium-section-container_1440' + sitecoreCss}>
        <div
          //${pageFields.IsPropertyPage ? 'bg-property' : 'bg-brand'}
          className={`sticky top-[73px] z-10 mb-[60px] flex w-full items-center justify-center bg-opacity-90 py-[15px] pl-[15px] backdrop-blur-xl lg:relative lg:top-0 lg:mb-[82px] lg:mt-[57px] lg:bg-opacity-100 ${pageFields.IsPropertyPage?.value ? 'bg-property' : 'bg-brand'}`}
        >
          <CatFilter
            cats={FILTER_TEXT}
            selectedCat={selectedCat}
            onClickCat={(cat) => setSelectedCat(cat)}
          />
        </div>
        <div className="mx-[15px] lg:mx-[30px]">
          <div className="grid place-items-stretch">
            <div
              className={`grid gap-x-[15px] lg:gap-x-[30px]`}
              style={{ gridTemplateColumns: 'auto auto auto' }}
            >
              {galleryData.map((col, index) => {
                return (
                  <div key={index} className="flex flex-col gap-y-[15px] lg:gap-y-[30px]">
                    {col.map((item, index) => {
                      if (
                        item.fields?.Tag?.fields.Title?.value == selectedCat ||
                        selectedCat == viewAllFilteringLabel
                      ) {
                        return (
                          <GalleryLightbox
                            galleryItems={galleryTemplateProps.fields.SelectedImages}
                            selectedItem={item}
                          >
                            <div className="hover:cursor-pointer">
                              {/* <FadeInUp key={index}> */}
                              <ImageClipOnHover
                                src={item?.fields?.Image.value?.src?.toString()!}
                                alt={`IMG`}
                              />
                              {/* </FadeInUp> */}
                            </div>
                          </GalleryLightbox>
                        );
                      } else {
                        return;
                      }
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default withDatasourceCheck()<GalleryTemplateProps>(Default);
