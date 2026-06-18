import React, { useState, useEffect, PropsWithChildren } from 'react';
import { addDays, isBefore, isSameDay } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { MobileCalendar } from 'components/ui/mobile-calendar';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import CheckInOut from '../../StayAtEast/CheckInOut';
import MobileDatePicker from './MobileDatePicker';

const publicUrl = getPublicUrl();
interface DatePickerSingleSelectionProps {
  className?: string;
  icon?: string;
  onDatePickerSelected?: (dateRange: DateRange) => void;
  field: any;
}

const DatePickerSingleSelection = ({
  className,
  icon = `icon_arrow_down_w.svg`,
  children,
  onDatePickerSelected,
  field,
}: PropsWithChildren<DatePickerSingleSelectionProps>) => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 1),
  });
  const [sameStartEndDate, setSameStartEndDate] = useState(false);
  const [confirmedDate, setConfirmedDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 1),
  });
  const [isCalenderOpen, setIsCalenderOpen] = useState(false);
  const [showMobileDatePicker, setShowMobileDatePicker] = useState(false);
  const [mobileTopAndBottomHeight, setMobileTopAndBottomHeight] = useState(0);

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild className="hover:cursor-pointer" style={{ WebkitAppearance: 'none' }}>
          {children}
        </PopoverTrigger>
        <PopoverContent
          className="mr-4 w-auto rounded-none border-0 shadow-[0px_5px_10px_#0000001A]"
          align="start"
        >
          <Calendar
            initialFocus
            mode="single"
            // defaultMonth={date?.from}
            selected={field.value}
            onSelect={field.onChange}
            numberOfMonths={1}
            showConfirmBtn={false}
            showCancelBtn={false}
            // onConfirmClicked={() => {
            //   setConfirmedDate(date);
            //   setIsCalenderOpen(false);
            //   //   onDatePickerSelected(date!);
            // }}
            // onCancelClicked={() => {
            //   setIsCalenderOpen(false);
            // }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
export default DatePickerSingleSelection;
