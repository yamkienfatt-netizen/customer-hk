import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import CloseButton from './CloseButton';
import RichTextTypography from '../../Typography/RichTextTypography';
import React from 'react';
import { RichTextField, RichText as ScRichText } from '@sitecore-jss/sitecore-jss-nextjs';

export function TableLightBox({ children, table }:{table: RichTextField}) {
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
          <DialogContent className="h-screen w-full flex-col items-center justify-center overflow-auto bg-property px-[15px] lg:flex">
            <div className="overflow-auto">
              <div className="mb-[32px] flex justify-end">
                <DialogClose className="focus:outline-none">
                  <CloseButton
                    onClick={() => handleCloseDialog()}
                    className="mt-3 focus:outline-none"
                  />
                </DialogClose>
              </div>

              <RichTextTypography>
                <div className="compareVenue items-center lg:flex lg:justify-center">
                  <ScRichText field={table} />
                </div>
              </RichTextTypography>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
