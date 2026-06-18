import React, { useState, useEffect } from 'react';
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
interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  textColor: string;
  icon: string;
  underline: boolean;
  calendarType: 'default' | 'mobile';
  checkInOutExtraStyles?: string;
  onDatePickerSelected: (dateRange: DateRange) => void;
}

export function DatePickerWithRange({
  className,
  textColor = 'white',
  icon = `icon_arrow_down_w.svg`,
  underline = false,
  calendarType = 'default',
  checkInOutExtraStyles,
  onDatePickerSelected,
}: DatePickerWithRangeProps) {
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

  useEffect(() => {
    calendarType == 'default' && setShowMobileDatePicker(false);
  }, [calendarType]);

  const handleCalendarSelect = (range, selectedDay, activeModifiers) => {
    const isSameDate =
      range?.to && range.from && range?.from && isSameDay(new Date(range.from), new Date(range.to));

    const isBeforeSelectedDate =
      date && date.from && isBefore(new Date(selectedDay), new Date(date?.from));

    // console.log('onSelect', { range, selectedDay, date, isBeforeSelectedDate });

    if (
      //Selected date range
      //Date range not the same
      //Last selection sameStartEndDate NOT true: not RESET on prev selection
      //=> Legit range selection => on next selection should RESET (setDate from and to same date)
      (range?.from !== undefined && range?.to !== undefined && !isSameDate && !sameStartEndDate) ||
      range?.to == undefined ||
      isBeforeSelectedDate
    ) {
      //RESET
      setDate({ from: selectedDay, to: selectedDay });
      setSameStartEndDate(true);
    } else {
      //NORMAL
      setDate(range);
      setSameStartEndDate(false);
    }
  };

  const onDayMouseEnter = (event) => {
    if (date?.from !== date?.to || (!date?.from && !date?.to)) return;

    const currentButton = (event.target as HTMLTableCellElement).closest('td')!;
    const tbody = currentButton.closest('.rdp-root');
    const buttons = Array.from(tbody!.querySelectorAll('td'));
    const currentIdx = buttons.indexOf(currentButton);
    const selectedIdx = buttons.findIndex(
      (btn) => btn.getAttribute('aria-selected') === 'true' && btn.getAttribute('data-outside') !== 'true'
    );
    const selectedButtons: any[] = [];

    const start = Math.min(currentIdx, selectedIdx);
    const end = Math.max(currentIdx, selectedIdx);
    console.log('start', start, 'end', end);

    for (let i = start; i <= end; i++) {
      selectedButtons.push(buttons[i]);
    }

    buttons.forEach((item) => {
      item.setAttribute('data-hover', selectedButtons.includes(item) ? 'true' : 'false');
      item.setAttribute('data-start', selectedButtons[0] === item ? 'true' : 'false');
      item.setAttribute(
        'data-end',
        selectedButtons[selectedButtons.length - 1] === item ? 'true' : 'false'
      );
    });
  };

  return (
    <div className={cn('grid w-full gap-2', className)}>
      <Popover
        open={calendarType == 'default' ? isCalenderOpen : false}
        onOpenChange={(open) => {
          if (calendarType == 'default') {
            setIsCalenderOpen(open);
          }
        }}
      >
        <PopoverTrigger asChild style={{ WebkitAppearance: 'none' }}>
          <Button
            id="date"
            variant={'ghost'}
            className={cn(
              `grid w-full grid-cols-2 place-content-between ${underline && 'gap-5'}`,
              // 'lg:w-[400px] flex-col lg: flex-row justify-between',
              !date && 'text-muted-foreground'
            )}
            size={'plain'}
            onClick={() => calendarType == 'mobile' && setShowMobileDatePicker(true)}
          >
            <CheckInOut
              textColor={textColor}
              icon={`${publicUrl}/${icon}`}
              confirmedDate={confirmedDate}
              underline={underline}
              checkInOutExtraStyles={checkInOutExtraStyles}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="mr-4 w-auto rounded-none border-0 shadow-[0px_5px_10px_#0000001A]"
          align="start"
        >
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleCalendarSelect}
            numberOfMonths={2}
            sameStartEndDate={sameStartEndDate}
            onConfirmClicked={() => {
              setConfirmedDate(date);
              setIsCalenderOpen(false);
              onDatePickerSelected(date!);
            }}
            onCancelClicked={() => {
              setIsCalenderOpen(false);
            }}
            onDayMouseEnter={(_, __, event) => onDayMouseEnter(event)}
          />
        </PopoverContent>
      </Popover>

      <MobileDatePicker
        isOpen={showMobileDatePicker}
        onCloseButtonClicked={() => setShowMobileDatePicker(false)}
        textColor={'#1d2021'}
        icon={'icon_header_arrow.svg'}
        // confirmedDate={confirmedDate}
        confirmedDate={date}
        underline={underline}
        date={date}
        onComponentRendered={(topAndBottomHeight: number) => {
          setMobileTopAndBottomHeight(topAndBottomHeight);
        }}
        onConfirmClicked={() => {
          setConfirmedDate(date);
          onDatePickerSelected(date!);
          setShowMobileDatePicker(false);
        }}
      >
        <MobileCalendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={handleCalendarSelect}
          numberOfMonths={2}
          mobileTopAndBottomHeight={mobileTopAndBottomHeight}
          sameStartEndDate={sameStartEndDate}
          onDayMouseEnter={(_, __, event) => onDayMouseEnter(event)}
        />
      </MobileDatePicker>
    </div>
  );
}
