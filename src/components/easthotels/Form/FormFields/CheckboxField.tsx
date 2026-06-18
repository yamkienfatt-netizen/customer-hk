import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import Typography from '../../Typography/Typography';
import { Checkbox } from 'components/ui/checkbox';

interface CheckboxFieldProps {
  control: any;
  name: string;
  label: React.ReactNode;
  onParentChange?: () => void; // Add onParentChange prop
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({ control, name, label, onParentChange }) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 ">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={(checked) => {
                field.onChange(checked);
                if (onParentChange) {
                  onParentChange();
                }
              }}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>
              <Typography variant="p">{label}</Typography>
            </FormLabel>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default CheckboxField;
