import { type TailwindConfig, Tailwind as TW } from "@react-email/components";
import type React from "react";

type TailwindCSSProps = {
  children: React.ReactNode;
};

const config: TailwindConfig = {
  theme: {
    extend: {
      colors: {
        background: "oklch(1 0 0)",
        foreground: "oklch(0.141 0.005 285.823)",
        card: "oklch(1 0 0)",
        "card-foreground": "oklch(0.141 0.005 285.823)",
        popover: "oklch(1 0 0)",
        "popover-foreground": "oklch(0.141 0.005 285.823)",
        primary: "oklch(0.441 0.165 264.07)",
        "primary-foreground": "oklch(0.985 0 0)",
        secondary: "oklch(0.967 0.001 286.375)",
        "secondary-foreground": "oklch(0.21 0.006 285.885)",
        muted: "oklch(0.967 0.001 286.375)",
        "muted-foreground": "oklch(0.552 0.016 285.938)",
        accent: "oklch(0.967 0.001 286.375)",
        "accent-foreground": "oklch(0.21 0.006 285.885)",
        destructive: "oklch(0.637 0.237 25.331)",
        "destructive-foreground": "oklch(0.637 0.237 25.331)",
        border: "oklch(0.92 0.004 286.32)",
        input: "oklch(0.871 0.006 286.286)",
        ring: "oklch(0.871 0.006 286.286)",
      },
    },
  },
};

export function Tailwind({ children }: TailwindCSSProps) {
  return <TW config={config}>{children}</TW>;
}
