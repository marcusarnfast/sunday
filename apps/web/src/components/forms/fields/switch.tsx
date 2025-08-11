import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@sunday/ui/components/form";
import { Switch } from "@sunday/ui/components/switch";
import type { Control, FieldValues, Path } from "react-hook-form";

type Props<T extends FieldValues> = {
  control: Control<T>;
  label: string;
  name: Path<T>;
  readOnly?: boolean;
  optional?: boolean;
  description?: string;
};

export function SwitchField<T extends FieldValues>({
  control,
  label,
  name,
  readOnly,
  optional,
  description,
}: Props<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between gap-1">
            <FormLabel>{label}</FormLabel>
            {optional && (
              <span className="text-muted-foreground text-xs font-medium">
                Optional
              </span>
            )}
            {readOnly && (
              <span className="text-muted-foreground text-xs font-medium">
                Read only
              </span>
            )}
          </div>
          <FormControl>
            <Switch
              {...field}
              checked={field.value}
              onCheckedChange={(checked) => {
                if (readOnly) return;
                field.onChange(checked);
              }}
              disabled={readOnly}
            />
          </FormControl>
          <FormMessage />
          {description && (
            <FormDescription className="text-muted-foreground text-xs">
              {description}
            </FormDescription>
          )}
        </FormItem>
      )}
    />
  );
}
