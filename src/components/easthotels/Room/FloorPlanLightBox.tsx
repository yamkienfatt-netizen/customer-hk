import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ReactNode } from 'react';
import CloseButton from '../CustomTypes/Components/CloseButton';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import { ImageField, Image as ScImage } from '@sitecore-jss/sitecore-jss-nextjs';
import ComponentError from '../Error/ComponentError';

interface FloorPlanLightBoxProps {
  url?: string;
  floorplanImage?: ImageField;
  children: ReactNode;
}

export function FloorPlanLightBox({ url, floorplanImage, children }: FloorPlanLightBoxProps) {
  try {
    const publicUrl = getPublicUrl();

    return (
      <>
        <Dialog>
          <DialogTrigger asChild style={{WebkitAppearance: 'none'}}>
            <div className="hover:cursor-pointer">{children}</div>
          </DialogTrigger>
          <DialogContent className=" h-full w-full bg-property">
            <div className="flex h-full w-full flex-col items-center justify-center">
              {/* Todo: Need to remove url at the end of the development. Url is currently a back-compatible */}
              <div className={'mx-[20px] border-[1px] border-black'}>
                {floorplanImage ? (
                  <ScImage field={floorplanImage} className="w-full max-w-[575px]" />
                ) : (
                  <img src={url ? url : `${publicUrl}/dummy_floorplan.png`} />
                )}
              </div>
              <div className="absolute right-[15px] top-[20px] lg:static lg:mt-[30px]">
                <DialogClose className=" focus:outline-none ">
                  <CloseButton className="focus:outline-none" />
                </DialogClose>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
}
