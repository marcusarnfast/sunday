import "@sunday/ui/globals.css";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { ClientProviders } from "~/providers/client";
import { ServerProviders } from "~/providers/server";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Sunday",
  description: "Sunday",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ServerProviders>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${manrope.variable} font-sans antialiased has-data-[layout=dashboard]:bg-primary has-data-[layout=auth]:bg-background`}
        >
          <ClientProviders>{children}</ClientProviders>
        </body>
      </html>
    </ServerProviders>
  );
}
