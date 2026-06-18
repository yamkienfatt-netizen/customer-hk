import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import Typography from '../../Typography/Typography';

interface RadioGroupFieldProps {
  control: any;
  name: string;
  label: string;
  options: Array<{key: string; value: string}>;
  required?: boolean;
}

const RadioGroupField: React.FC<RadioGroupFieldProps> = ({
  control,
  name,
  label,
  options,
  required,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>
            <Typography variant={'l1'} fontWeight="bold">
              {label}
              {required && <span className="text-orange-primary"> *</span>}
            </Typography>
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex space-x-3"
            >
              {options.map((option) => (
                <FormItem className="flex items-center space-x-3 space-y-0" key={option.key}>
                  <FormControl>
                    <RadioGroupItem value={option.key} />
                  </FormControl>
                  <FormLabel className="">
                    <Typography variant={'p'}>{option.value}</Typography>
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RadioGroupField;
