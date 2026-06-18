import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ReactNode, useState } from 'react';
import CloseButton from '../CustomTypes/Components/CloseButton';
import {
  Text as ScText,
  Image as ScImage,
  useSitecoreContext,
  LayoutServicePageState,
} from '@sitecore-jss/sitecore-jss-nextjs';
import CarouselBanner8 from '../CarouselBanner/CarouselBanner8';
import useWindowSize from 'src/hooks/useWindowSize';
import { Treelist } from '@/props/fields/ScField';
import { GalleryImageWithTag } from '@/props/Media/GalleryTemplateProps';
import { _PageMetadata } from '@/props/common/_PageMetadata';
import { PageRouteFields } from '@/props/Core/PageProps';
import ComponentError from '../Error/ComponentError';

export type GalleryItemType = {
  name: string;
  tag: string;
  id: string;
  url: string;
  fields: {
    Image: {
      value: {
        src: string;
        alt: string;
        width: string;
        height: string;
      };
    };
  };
};

interface GalleryLightboxProp {
  galleryItems: Treelist<GalleryImageWithTag>[];
  selectedItem: Treelist<GalleryImageWithTag>;
  children: ReactNode;
  IsPropertyInnerPage: boolean;
  IsBrandInnerPage: boolean;
}

export function GalleryLightbox({
  galleryItems,
  selectedItem,
  children,
  IsPropertyInnerPage,
  IsBrandInnerPage,
}: GalleryLightboxProp) {
  try {
    const { height: windowHeight, width: windowWidth } = useWindowSize().windowSize;
    const { isMobile } = useWindowSize();

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleOpenDialog = () => {
      setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
      setIsDialogOpen(false);
    };

    const carouselImgWidth = isMobile
      ? windowWidth
      : windowWidth && windowWidth >= 1280
        ? 806
        : windowWidth && windowWidth * 0.5;

    const carouselBannerHeight = windowHeight ? windowHeight * 0.95 : 0;
    const context = useSitecoreContext();
    const { route } = context.sitecoreContext;
    const pageFields = route?.fields as PageRouteFields & _PageMetadata;

    return (
      <>
        <Dialog>
          <DialogTrigger asChild onClick={handleOpenDialog} style={{WebkitAppearance: 'none'}}>
            {children}
          </DialogTrigger>
          {isDialogOpen && (
            <DialogContent className="h-[100%] w-[100%] justify-center bg-property">
              <div
                className="flex w-full justify-end pr-[30px]"
                style={{ height: windowHeight ? windowHeight * 0.05 : 0 }}
              >
                <DialogClose className="focus:outline-none">
                  <CloseButton
                    onClick={() => handleCloseDialog()}
                    className="mt-3 focus:outline-none"
                  />
                </DialogClose>
              </div>
              <div style={{ height: windowHeight ? windowHeight * 0.95 : 0 }}>
                <CarouselBanner8
                  height={carouselBannerHeight}
                  imgHeight={isMobile ? carouselBannerHeight * 0.6 : carouselBannerHeight * 0.85}
                  imgWidth={carouselImgWidth || 0}
                  imgClassName={isMobile ? 'object-contain' : 'object-contain'}
                  paginationHeight={carouselBannerHeight * 0.05}
                  captionHeight={carouselBannerHeight * 0.1}
                  galleryItems={galleryItems}
                  selectedId={selectedItem.id}
                  IsPropertyInnerPage={pageFields.IsPropertyInnerPage.value}
                  IsBrandInnerPage={pageFields.IsBrandInnerPage.value}
                />
              </div>
            </DialogContent>
          )}
        </Dialog>
      </>
    );
  } catch (err) {
    return <ComponentError error={err} />
  }
}
