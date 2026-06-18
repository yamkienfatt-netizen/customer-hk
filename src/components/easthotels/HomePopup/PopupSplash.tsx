import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogOverlay,
} from '@/components/ui/trans-overlay-dialog';
import Typography from '../Typography/Typography';
import CloseButton from '../CustomTypes/Components/CloseButton';
import {
  Text as ScText,
  RichText as ScRichText,
  Image as ScImage,
  useSitecoreContext,
  LayoutServicePageState,
  LinkField,
  TextField,
  withDatasourceCheck,
} from '@sitecore-jss/sitecore-jss-nextjs';
import RichTextTypography from '../Typography/RichTextTypography';
import CTAButton from '../Button/CTAButton';
import { PopupSpashProps } from '@/props/HomePopup/PopupSplashProps';
import { PageRouteFields } from '@/props/Core/PageProps';
import { _PageMetadata } from '@/props/common/_PageMetadata';

const Default = (popupSpashProps: PopupSpashProps) => {
  const context = useSitecoreContext();
  const { route } = context.sitecoreContext;
  const pageFields = route?.fields as PageRouteFields & _PageMetadata;

  if (!popupSpashProps.fields?.Visible?.value) {
    return <></>;
  }

  return (
    <Dialog defaultOpen>
      <DialogOverlay>
        <DialogContent
          //max-w-[345px]
          className={`flex max-h-[95vh] w-full max-w-[90vw] justify-center bg-transparent lg:max-w-[800px] lg:items-center`}
        >
          <div>
            <div className="sticky top-0 flex w-full justify-end bg-transparent py-[10px] lg:relative ">
              <DialogClose className="focus:outline-none">
                <CloseButton className="mt-3 focus:outline-none" />
              </DialogClose>
            </div>
            <div className="max-h-[85svh] overflow-y-auto lg:flex lg:flex-row ">
              <ScImage
                field={popupSpashProps.fields.Image}
                className="h-[441px] max-h-[300px] w-[345px] object-cover lg:h-[511px] lg:max-h-none lg:w-[400px]"
                srcSet={[{ mw: 400 }, { mw: 345 }]}
                sizes="(min-width: 992px) 400px, 345px"
              />

              <div className="bg-white px-[15px] pb-[60px] lg:h-[512px] lg:w-[400px] lg:px-[30px] lg:pb-0">
                <div className="pt-[23px] lg:mt-[50px]">
                  <Typography variant="h3" font="Bellefair" className="hyphens-auto break-words">
                    <ScText field={popupSpashProps.fields.Title} />
                  </Typography>
                </div>
                <div className="mt-[33px] lg:mt-[40px]">
                  <Typography variant="p">
                    <RichTextTypography>
                      <ScRichText field={popupSpashProps.fields.Content} />
                    </RichTextTypography>
                  </Typography>
                </div>

                <div className="mt-[33px] lg:mt-[40px]">
                  <CTAButton
                    url={popupSpashProps.fields.CTAUrl as LinkField}
                    text={popupSpashProps.fields.CTAText as TextField}
                    variant="underlined"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* </div> */}
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default withDatasourceCheck()<PopupSpashProps>(Default);
