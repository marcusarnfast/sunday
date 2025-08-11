import { cn } from "@sunday/ui/utils/cn";
import * as React from "react";

const TabHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "has-data-[slot=tab-header-actions]:flex gap-4  has-data-[slot=tab-header-actions]:justify-between pb-6",
      className,
    )}
    {...props}
  />
));

TabHeader.displayName = "TabHeader";

const TabHeaderTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    data-slot="tab-header-title"
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
));

TabHeaderTitle.displayName = "TabHeaderTitle";

const TabHeaderDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="tab-header-description"
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));

TabHeaderDescription.displayName = "TabHeaderDescription";

const TabHeaderActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    data-slot="tab-header-actions"
    ref={ref}
    className={cn("flex items-center gap-2", className)}
    {...props}
  />
));

TabHeaderActions.displayName = "TabHeaderActions";

export { TabHeader, TabHeaderTitle, TabHeaderDescription, TabHeaderActions };
