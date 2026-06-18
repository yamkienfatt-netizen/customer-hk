import React, { ReactNode, useEffect, useRef, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import CloseButton from './CloseButton';
import CheckInOut from '../../StayAtEast/CheckInOut';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import { MobileCalendar } from 'components/ui/mobile-calendar';
import Typography from '../../Typography/Typography';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import { useI18n } from 'next-localization';

const publicUrl = getPublicUrl();

interface MobileDatePickerProps {
  isOpen: boolean;
  onCloseButtonClicked: () => void;
  textColor: string;
  icon: string;
  confirmedDate: DateRange | undefined;
  underline: boolean;
  date: DateRange | undefined;
  children: ReactNode;
  onComponentRendered: (topAndBottomHeight: number) => void;
  onConfirmClicked: () => void;
}

const MobileDatePicker = ({
  isOpen = false,
  onCloseButtonClicked,
  textColor,
  icon,
  confirmedDate,
  underline,
  date,
  children,
  onComponentRendered,
  onConfirmClicked,
}: MobileDatePickerProps) => {
  const [topAndBottomHeight, setTopAndBottomHeight] = useState(0);

  const topContainerRef = useRef(null);
  const buttonRef = useRef(null);
  const { t } = useI18n();
  useEffect(() => {
    // console.log('containersHeight', {
    //   top: topContainerRef?.current?.offsetHeight,
    //   bottom: buttonRef?.current?.offsetHeight,
    //   topAndBottomHeight: topAndBottomHeight,
    // });
    if (topContainerRef.current && buttonRef.current) {
      onComponentRendered(
        topContainerRef?.current?.offsetHeight + buttonRef?.current?.offsetHeight
      );
    }
  }, [topContainerRef.current, buttonRef.current]);

  return (
    <Sheet open={isOpen}>
      <SheetContent className="w-full p-0">
        <div className={`p-5`} ref={topContainerRef}>
          <div className="mb-10 flex justify-end">
            <CloseButton onClick={onCloseButtonClicked} />
          </div>
          <Button
            id="date"
            variant={'ghost'}
            className={cn(
              `grid w-full grid-cols-2 place-content-center gap-5`,
              !date && 'text-muted-foreground'
            )}
            size={'plain'}
          >
            <CheckInOut
              textColor={textColor}
              icon={`${publicUrl}/${icon}`}
              confirmedDate={confirmedDate}
              underline={underline}
              underlineClassName={'border-black-secondary'}
            />
          </Button>
        </div>

        <hr className="mb-[26px] w-full border-black-secondary" />

        <div className="h-[67vh] overflow-auto">{children}</div>
        <SheetFooter className="absolute bottom-0 flex w-screen justify-center">
          <button
            className="flex w-full items-center justify-center bg-green-primary py-[17px] shadow-[#00000029_0px_-5px_10px]"
            ref={buttonRef}
            onClick={onConfirmClicked}
          >
            <Typography variant="l3" fontColor={'white'} extraStyles="mt-[5px]">
              {t(DICTIONARY_CONSTANT.RESERVATIONS.CALENDAR_CONFIRM)}
            </Typography>
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default MobileDatePicker;
