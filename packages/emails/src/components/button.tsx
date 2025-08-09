import { Button as ButtonComponent } from "@react-email/components";
import {
  buttonVariants,
  type VariantProps,
} from "@sunday/ui/components/button";

type ButtonProps = {
  children: React.ReactNode;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  className?: string;
  href: string;
};

export default function Button({
  children,
  href,
  className,
  variant = "default",
  size = "default",
}: ButtonProps) {
  return (
    <ButtonComponent
      href={href}
      className={buttonVariants({ variant, size, className })}
    >
      {children}
    </ButtonComponent>
  );
}
