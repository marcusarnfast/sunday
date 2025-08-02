import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@sunday/ui/components/form";
import { Textarea } from "@sunday/ui/components/textarea";
import type { Control, FieldValues, Path } from "react-hook-form";

type Props<T extends FieldValues> = {
  control: Control<T>;
  label: string;
  name: Path<T>;
  placeholder?: string;
  readOnly?: boolean;
  optional?: boolean;
  rows?: number;
};

export function TextAreaField<T extends FieldValues>({
  control,
  label,
  name,
  placeholder,
  readOnly,
  optional,
  rows = 4,
}: Props<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between gap-1">
            <FormLabel>{label}</FormLabel>
            {optional && <span className="text-muted-foreground text-xs font-medium">Optional</span>}
          </div>
          <FormControl>
            <Textarea
              {...field}
              readOnly={readOnly}
              rows={rows}
              value={field.value === undefined || field.value === null ? "" : field.value}
              placeholder={placeholder}
              onChange={(e) => {
                if (readOnly) return;
                const value = e.target.value;
                field.onChange(value);
              }}
            />
          </FormControl>
          <FormMessage />
          {readOnly && (
            <FormDescription className="text-muted-foreground text-xs">This field is read only and cannot be changed</FormDescription>
          )}
        </FormItem>
      )}
    />
  );
}

