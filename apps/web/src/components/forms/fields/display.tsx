import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@sunday/ui/components/form";
import { Input } from "@sunday/ui/components/input";
import type { Control, FieldValues, Path } from "react-hook-form";

type Props = {
  label: string;
  name: string;
  placeholder?: string;
  readOnly?: boolean;
  optional?: boolean;
  value?: string;
};

export function DisplayField({
  label,
  name,
  placeholder,
  optional,
  value,
}: Props) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between gap-1">
            <FormLabel>{label}</FormLabel>
            <span className="text-muted-foreground text-xs font-medium">Read only</span>
          </div>
          <FormControl>
            <Input
              {...field}
              readOnly={true}
              value={value}
              placeholder={placeholder}
              onChange={(e) => {
                return;
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

