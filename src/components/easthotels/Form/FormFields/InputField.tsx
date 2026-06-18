import React from 'react';
import { FormItem, FormLabel, FormControl, FormMessage, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Typography from 'components/easthotels/Typography/Typography';

interface InputFieldProps {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ control, name, label, placeholder, required }) => {
  const { register } = control;

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem className="w-full">
          <FormLabel>
            <Typography variant={'l1'} fontWeight="bold">
              {label}
              {required && <span className="text-orange-primary"> *</span>}
            </Typography>
          </FormLabel>
          <FormControl>
            <Input placeholder={placeholder || ''} className={'bg-inherit'} {...register(name)} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InputField;
