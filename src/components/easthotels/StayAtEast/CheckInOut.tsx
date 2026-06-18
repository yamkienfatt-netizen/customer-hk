import React from 'react';
import Typography from '../Typography/Typography';
import { DateRange } from 'react-day-picker';
import { addDays, format, isSameDay } from 'date-fns';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import { useI18n } from 'next-localization';
import ComponentError from '../Error/ComponentError';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const CheckInOut = ({
  textColor,
  icon,
  confirmedDate,
  underline,
  underlineClassName,
  checkInOutExtraStyles,
}: {
  textColor: string;
  icon: string;
  confirmedDate: DateRange | undefined;
  underline: boolean;
  underlineClassName?: string;
  checkInOutExtraStyles?: string;
}) => {
  try {
    const { t, locale } = useI18n();
    const pathname = usePathname();

    return (
      <>
        <div>
          <div className="mb-[10px] flex">
            <Typography
              variant="l1"
              fontColor={textColor}
              fontWeight="bold"
              extraStyles={checkInOutExtraStyles}
            >
              {t(DICTIONARY_CONSTANT.RESERVATIONS.CHECK_IN)}
            </Typography>
            <Image
              src={icon}
              alt="arrow_down"
              className="ml-[5px] mt-[-4px]"
              width={6}
              height={22}
            />
          </div>
          <Typography
            variant="p"
            fontColor={textColor}
            extraStyles="text-left text-black-secondary"
          >
            {confirmedDate?.from
              ? pathname.includes('miami')
                ? format(confirmedDate.from, 'MM/dd/yyyy')
                : format(confirmedDate.from, 'dd/MM/yyyy')
              : ''}
          </Typography>
          {underline && (
            <div className={`mt-[5px] border-b-2 ${underlineClassName && underlineClassName}`} />
          )}
        </div>
        <div>
          <div className="mb-[10px] flex">
            <Typography
              variant="l1"
              fontColor={textColor}
              fontWeight="bold"
              extraStyles={checkInOutExtraStyles}
            >
              {t(DICTIONARY_CONSTANT.RESERVATIONS.CHECK_OUT)}
            </Typography>
            <Image
              src={icon}
              alt="arrow_down"
              className="ml-[5px] mt-[-4px]"
              width={6}
              height={22}
            />
          </div>
          <Typography
            variant="p"
            fontColor={textColor}
            extraStyles="text-left text-black-secondary"
          >
            {confirmedDate?.to
              ? pathname.includes('miami')
                ? format(confirmedDate.to, 'MM/dd/yyyy')
                : format(confirmedDate.to, 'dd/MM/yyyy')
              : ''}
          </Typography>
          {underline && (
            <div className={`mt-[5px] border-b-2 ${underlineClassName && underlineClassName}`} />
          )}
        </div>
      </>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default CheckInOut;
