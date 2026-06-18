import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import Typography from '../../Typography/Typography';
import { Checkbox } from 'components/ui/checkbox';

interface CheckboxGroupFieldProps {
  control: any;
  name: string;
  options: any;
}
const CheckboxGroupField: React.FC<CheckboxGroupFieldProps> = ({
  control,
  name,

  options,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-1">
            {options.map(({key, value}:{key:string, value:string}) => (
              <FormItem key={value} className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes(value)}
                    onCheckedChange={(checked) => {
                      const updatedValue = field.value || []; // Initialize field.value to an empty array if it's undefined or null
                      return checked
                        ? field.onChange([...updatedValue, value])
                        : field.onChange(updatedValue.filter((value:string) => value !== value));
                    }}
                  />
                </FormControl>
                <FormLabel>
                  <Typography variant="p">{key}</Typography>
                </FormLabel>
              </FormItem>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CheckboxGroupField;
