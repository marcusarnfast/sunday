import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@sunday/ui/components/form";
import { Input } from "@sunday/ui/components/input";

type Props = {
  label: string;
  name: string;
  placeholder?: string;
  readOnly?: boolean;
  optional?: boolean;
  value?: string;
};

export function DisplayField({ label, name, placeholder, value }: Props) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between gap-1">
            <FormLabel>{label}</FormLabel>
            <span className="text-muted-foreground text-xs font-medium">
              Read only
            </span>
          </div>
          <FormControl>
            <Input
              {...field}
              readOnly={true}
              value={value}
              placeholder={placeholder}
              onChange={() => {
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
