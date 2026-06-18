import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import Typography from '../../Typography/Typography';
import { ReactNode } from 'react';
import {
  Text as ScText,
  Image as ScImage,
  ImageField,
  TextField,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { SitecoreLink   } from './SitecoreLink';

interface QrCodeDialogProps {
  children: ReactNode;
  qrCodeImg: ImageField;
  desc: TextField;
  descIc: ImageField;
}
// reusable component
// ToDo: wen please convert for photo wall components.
export function QrCodeDialog({ children, qrCodeImg, desc, descIc }: QrCodeDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild style={{WebkitAppearance: 'none'}}>{children}</DialogTrigger>
      <DialogContent>
        <div className="flex h-screen w-full flex-col items-center justify-center bg-brand">
          <div className="h-[272px] w-[235px] bg-white p-[27px]">
            <ScImage field={qrCodeImg} className="h-[193px] w-[193px] object-contain" />
            <div className="flex flex-row justify-center">
              <ScImage field={descIc} className="mt-[10px] h-[20-px] w-[35px] object-fill" />
              <Typography
                variant="l3"
                extraStyles="tracking=[1.12px] leading=[20px] mt-[15px] text-center"
              >
                <ScText field={desc} />
              </Typography>
            </div>
          </div>

          <DialogClose asChild>
            <div className="b mt-[30px] flex cursor-pointer flex-row border-b-[3px] border-black-secondary  decoration-2">
              <Typography variant="l1" extraStyles="mt-[-1px] mr-[4px]">
                x
              </Typography>
              <Typography variant="l1">CLOSE</Typography>
            </div>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
