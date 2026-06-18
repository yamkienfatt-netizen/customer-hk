import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayFlag, DayPicker, SelectionState, UI } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import Typography from 'components/easthotels/Typography/Typography';
import { format } from 'date-fns';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
// import { useI18n } from 'next-localization';
import { useI18n } from 'next-localization';
import { zhHK, zhCN, enUS } from 'date-fns/locale';

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  sameStartEndDate: boolean;
  onConfirmClicked: () => void;
  onCancelClicked: () => void;
  showConfirmBtn?: boolean;
  showCancelBtn?: boolean;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  sameStartEndDate,
  onConfirmClicked,
  onCancelClicked,
  showConfirmBtn = true,
  showCancelBtn = true,
  ...props
}: CalendarProps) {
  const { t, locale } = useI18n();

  const [lngObj, setLngObj] = useState(enUS);

  useEffect(() => {
    const currentLng = locale();
    if (currentLng == 'zh-HK') {
      setLngObj(zhHK);
    } else if (currentLng == 'zh-CN') {
      setLngObj(zhCN);
    } else {
      setLngObj(enUS);
    }
  }, []);

  return (
    <div className="p-[20px]">
      <div className="flex flex-row justify-between">
        {showCancelBtn && (
          <Typography
            variant="l1"
            extraStyles="mb-[30px] font-semibold decoration-2 underline-offset-4 underline hover:cursor-pointer"
            onClick={onCancelClicked}
          >
            {t(DICTIONARY_CONSTANT.RESERVATIONS.CALENDAR_CANCEL)}
          </Typography>
        )}

        {showConfirmBtn && (
          <Typography
            variant="l1"
            extraStyles="mb-[30px] font-semibold decoration-2 underline-offset-4 underline hover:cursor-pointer"
            onClick={onConfirmClicked}
          >
            {t(DICTIONARY_CONSTANT.RESERVATIONS.CALENDAR_CONFIRM)}
          </Typography>
        )}
      </div>
      <DayPicker
        locale={lngObj}
        showOutsideDays={showOutsideDays}
        formatters={
          locale() == 'en'
            ? {
                formatWeekdayName: (date, options) => {
                  return format(date, 'eee')[0];
                },
              }
            : {}
        }
        startMonth={new Date(new Date().getFullYear(), 0)}
        disabled={{ before: new Date() }}
        className={cn(className)}
        navLayout="around"
        classNames={{
          [UI.Months]: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
          [UI.Month]: 'space-y-4 relative',
          [UI.MonthCaption]: 'flex justify-center pt-1 relative items-center !mt-0',
          [UI.CaptionLabel]:
            'text-[13px] font-semibold font-[amiko] leading-[18px] text-black-secondary',
          [UI.Nav]: 'space-x-1 flex items-center',
          // nav_button: cn(
          //   buttonVariants({ variant: 'ghost' }),
          //   'h-7 w-7 bg-transparent p-0 text-black-secondary'
          // ),
          [UI.PreviousMonthButton]: cn(
            buttonVariants({ variant: 'ghost' }),
            'h-7 w-7 bg-transparent p-0 text-black-secondary',
            'absolute left-[-10px] top-0 !m-0'
          ),
          [UI.NextMonthButton]: cn(
            buttonVariants({ variant: 'ghost' }),
            'h-7 w-7 bg-transparent p-0 text-black-secondary',
            'absolute right-[-10px] top-0 !m-0'
          ),
          [UI.MonthGrid]: 'w-full border-collapse space-y-1',
          [UI.Weekdays]: 'flex',
          [UI.Weekday]:
            'rounded-full w-9 font-normal text-[11px] text-center text-black-secondary font-[amiko]',
          [UI.Week]: 'flex w-full mt-2',
          // cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-full [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-full last:[&:has([aria-selected])]:rounded-r-full focus-within:relative focus-within:z-20',
          [UI.Day]:
            'h-9 w-9 text-center text-sm p-0 relative hover:bg-accent rounded-full data-[hover=true]:bg-accent data-[hover=true]:rounded-none data-[start=true]:rounded-l-full data-[end=true]:rounded-r-full',
          [UI.DayButton]: cn(
            buttonVariants({ variant: 'ghost' }),
            'h-9 w-9 p-0 font-semibold font-[amiko] aria-selected:opacity-100 text-[13px] rounded-full'
          ),
          [SelectionState.selected]:
            'bg-green-primary data-[hover=true]:bg-green-primary text-primary-foreground hover:bg-green-secondary hover:text-primary-foreground focus:bg-green-primary focus:text-primary-foreground text-white',
          [DayFlag.today]: '',
          // 'bg-green-primary hover:bg-green-secondary  text-accent-foreground text-white',
          [DayFlag.outside]:
            'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
          [DayFlag.disabled]: 'text-muted-foreground opacity-50',
          [SelectionState.range_start]: !sameStartEndDate
            ? 'bg-green-primary rounded-tl-full rounded-bl-full rounded-tr-none rounded-br-none'
            : '',
          [SelectionState.range_end]: !sameStartEndDate
            ? 'bg-green-primary rounded-tl-none rounded-bl-none rounded-tr-full rounded-br-full'
            : '',
          [SelectionState.range_middle]:
            // 'aria-selected:bg-green-primary hover:bg-accent aria-selected:text-primary-foreground',
            'bg-green-primary rounded-none',
          [DayFlag.hidden]: 'invisible',
          [UI.Chevron]: 'h-4 w-4',
          ...classNames,
        }}
        components={{
          IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
          IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        }}
        {...props}
      />
    </div>
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
