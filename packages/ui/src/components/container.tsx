"use client";

import { cn } from "@sunday/ui/utils/cn";
import React from "react";

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
