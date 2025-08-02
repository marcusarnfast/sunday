"use client";

import React from "react";
import { cn } from "@sunday/ui/utils/cn";

const Container = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <section
    ref={ref}
    className={cn(
      "@container/main mx-auto max-w-7xl w-full p-4 sm:p-6",
      className,
    )}
    {...props}
  />
));

Container.displayName = "Container";

export { Container };
