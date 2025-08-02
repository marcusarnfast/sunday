"use client";

import { Toaster } from "@sunday/ui/components/sonner";
import { ThemeProvider } from "@sunday/ui/providers/theme";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ConvexClientProvider } from "./convex";

type ProvidersProps = {
  children: React.ReactNode;
};

export function ClientProviders({ children }: ProvidersProps) {
  return (
    <ConvexClientProvider>
      <NuqsAdapter>
        <ThemeProvider>
          {children}
          <Toaster closeButton />
        </ThemeProvider>
      </NuqsAdapter>
    </ConvexClientProvider>
  );
}
