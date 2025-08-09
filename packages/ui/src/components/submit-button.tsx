import { Button, type ButtonProps } from "@sunday/ui/components/button";
import { cn } from "@sunday/ui/utils/cn";
import { Loader2Icon } from "lucide-react";

type SubmitButtonProps = ButtonProps & {
  children: React.ReactNode;
  isSubmitting: boolean;
};

export function SubmitButton({
  children,
  isSubmitting,
  variant = "default",
  ...props
}: SubmitButtonProps) {
  return (
    <Button
      disabled={isSubmitting}
      variant={variant}
      {...props}
      className={cn(props.className, "relative")}
    >
      <span className={cn({ "opacity-0": isSubmitting })}>{children}</span>

      {isSubmitting && (
        <span className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2">
          <Loader2Icon className="h-4 w-4 animate-spin" />
        </span>
      )}
    </Button>
  );
}
