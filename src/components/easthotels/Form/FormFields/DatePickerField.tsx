import React from 'react';
import DatePickerSingleSelection from '../../CustomTypes/Components/DatePickerSingleSelection';
import { FormItem, FormLabel, FormControl, FormMessage, FormField } from '@/components/ui/form';
import Typography from 'components/easthotels/Typography/Typography';
import { format } from 'date-fns';
import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
const DatePickerField = ({ control, name, label, required = false }) => {
  const {t} = useI18n();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>
            <Typography variant={'l1'} fontWeight="bold">
              {label}
              {required && <span className="text-orange-primary"> *</span>}
            </Typography>
          </FormLabel>
          <DatePickerSingleSelection field={field}>
            <FormControl>
              <div className="flex h-10 w-full border-b border-[#4E4C4580] py-2">
                {field.value ? (
                  <Typography variant="p">{format(field.value, 'MM/dd/yyyy')}</Typography>
                ) : (
                  <Typography variant="p" fontColor="#1D20214D">
                    {t(DICTIONARY_CONSTANT.FORMS.FIELD_PLACEHOLDERS.PICK_A_DATE)}
                  </Typography>
                )}
              </div>
            </FormControl>
          </DatePickerSingleSelection>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DatePickerField;
