import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import { ReactNode, useEffect, useRef, useState } from 'react';

import CloseButton from '../CustomTypes/Components/CloseButton';
import { _ArticleCard } from '@/props/common/_ArticleCard';
import Typography from '../Typography/Typography';
import {
  Text as ScText,
  RichText as ScRichText,
  Image as ScImage,
  useSitecoreContext,
  LayoutServicePageState,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { _cta } from '@/props/common/_cta';
import ComponentError from '../Error/ComponentError';
import RichTextTypography from '../Typography/RichTextTypography';

const publicUrl = getPublicUrl();
const IsPropertyPage = false;
interface SpeakerBioLightboxProps {
  articleCard: _ArticleCard & _cta;
  children: ReactNode;
}

export function SpeakerBioLightbox({ articleCard, children }: SpeakerBioLightboxProps) {
  try {
    const { sitecoreContext } = useSitecoreContext();
    const isPageEditing = sitecoreContext.pageState === LayoutServicePageState.Edit;

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleOpenDialog = () => {
      setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
      setIsDialogOpen(false);
    };

    return (
      <>
        <Dialog>
          <DialogTrigger asChild onClick={handleOpenDialog} style={{WebkitAppearance: 'none'}}>
            {children}
          </DialogTrigger>
          {isDialogOpen && (
            <DialogContent
              className={`${IsPropertyPage ? 'bg-property' : 'bg-brand'}  flex h-full w-full justify-center overflow-y-auto px-[15px] lg:items-center`}
            >
              <div className="relative flex max-h-[100%] max-w-[345px] flex-col lg:max-w-[800px]">
                <div>
                  <div className="sticky top-0 flex w-full justify-end bg-inherit py-[10px] lg:relative">
                    <DialogClose className="focus:outline-none">
                      <CloseButton
                        onClick={() => handleCloseDialog()}
                        className="mt-3 focus:outline-none"
                      />
                    </DialogClose>
                  </div>
                  <div className="lg:flex lg:flex-row">
                    <ScImage
                      field={articleCard.Image}
                      className="h-[441px] w-[345px] object-cover lg:h-[511px] lg:w-[400px]"
                    />
                    <div className="pb-[60px] lg:h-[512px] lg:w-[400px] lg:bg-white lg:px-[30px] lg:pb-0">
                      {(articleCard.Title || isPageEditing) && (
                        <div className="mt-[23px] lg:mt-[50px]">
                          <Typography variant="h3" font="Bellefair">
                            <ScText field={articleCard.Title} />
                          </Typography>
                        </div>
                      )}
                      {(articleCard.SubTitle || isPageEditing) && (
                        <div className="mb-[33px] mt-[10px] lg:mb-[40px]">
                          <Typography variant="p">
                            <ScText field={articleCard.SubTitle} />
                          </Typography>
                        </div>
                      )}
                      {(articleCard.Content || isPageEditing) && (
                        <Typography variant="p">
                          {/* <ScText field={articleCard.Content} /> */}
                          <RichTextTypography>
                            <ScRichText field={articleCard.Content} />
                          </RichTextTypography>
                        </Typography>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
}
