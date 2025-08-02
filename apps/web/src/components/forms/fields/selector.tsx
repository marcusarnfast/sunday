import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@sunday/ui/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@sunday/ui/components/select";
import type { Control, FieldValues, Path } from "react-hook-form";

type Props<T extends FieldValues> = {
  control: Control<T>;
  label: string;
  name: Path<T>;
  placeholder?: string;
  readOnly?: boolean;
  options: {
    label: string;
    value: string;
  }[];
};

export function SelectorField<T extends FieldValues>({
  control,
  label,
  name,
  placeholder,
  readOnly,
  options,
}: Props<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between gap-1">
            <FormLabel>{label}</FormLabel>
          </div>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
          {readOnly && (
            <FormDescription className="text-muted-foreground text-xs">
              This field is read only and cannot be changed
            </FormDescription>
          )}
        </FormItem>
      )}
    />
  );
}
