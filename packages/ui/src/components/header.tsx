import { cn } from "@sunday/ui/utils/cn";
import * as React from "react";

const Header = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <section
    ref={ref}
    className={cn(
      "border-b border-border/90 bg-background/60 backdrop-blur-sm min-h-20 flex flex-col justify-center sticky top-0 z-40",
      className,
    )}
    {...props}
  />
));

Header.displayName = "Header";

const HeaderContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <section
    ref={ref}
    className={cn("p-4 sm:p-6 w-full max-w-7xl mx-auto", className)}
    {...props}
  />
));

HeaderContent.displayName = "HeaderContent";

const HeaderTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn(
      "font-semibold text-foreground text-xl tracking-tight duration-150 transition-all sm:text-2xl/7",
      className,
    )}
    {...props}
  />
));
HeaderTitle.displayName = "HeaderTitle";

const HeaderDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-muted-foreground text-xs/4 duration-150 transition-all sm:text-sm/6",
      className,
    )}
    {...props}
  />
));
HeaderDescription.displayName = "HeaderDescription";

export { Header, HeaderContent, HeaderDescription, HeaderTitle };
