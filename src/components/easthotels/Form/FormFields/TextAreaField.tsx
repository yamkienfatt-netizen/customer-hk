import React from 'react';
import { FormItem, FormLabel, FormControl, FormMessage, FormField } from '@/components/ui/form';
import Typography from 'components/easthotels/Typography/Typography';
import { Textarea } from '@/components/ui/textarea';

interface TextAreaFieldProps {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  control,
  name,
  label,
  placeholder,
  required,
}) => {
  const { register } = control;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            <Typography variant={'l1'} fontWeight="bold">
              {label}
              {required && <span className="text-orange-primary"> *</span>}
            </Typography>
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              className={`resize-none border-[#4E4C4580] bg-inherit`}
              {...field}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TextAreaField;
