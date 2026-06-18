import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Typography from '../../Typography/Typography';
import clsx from 'clsx';

interface SelectFieldProps {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  options: any;
  required?: boolean;
  onValueChange?: (value: any) => void;
}

const SelectField: React.FC<SelectFieldProps> = ({
  control,
  name,
  label,
  placeholder,
  options,
  required,
  onValueChange,
}) => {
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
          <Select
            onValueChange={
              onValueChange
                ? (value) => {
                    onValueChange(value);
                    field.onChange(value);
                  }
                : field.onChange
            }
            defaultValue={field.value}
          >
            <FormControl>
              <div className="">
                <SelectTrigger
                  className={`w-full bg-inherit hover:outline-none focus-visible:outline-none lg:min-w-[80px]`}
                >
                  <Typography variant={'p'}>
                    <SelectValue className=""></SelectValue>
                  </Typography>
                </SelectTrigger>
              </div>
            </FormControl>
            <SelectContent>
              <div className="max-h-72">
                {options &&
                  options.map(({ key, value }: { key: string; value: string }) => (
                    <SelectItem
                      key={value}
                      value={value}
                      className="bg-transparent px-2 underline-offset-4 hover:cursor-pointer hover:underline hover:decoration-2 hover:outline-none"
                    >
                      <Typography variant={'p'}>{key}</Typography>
                    </SelectItem>
                  ))}
              </div>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export default SelectField;
