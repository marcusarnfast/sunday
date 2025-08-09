import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

type ProvidersProps = {
  children: React.ReactNode;
};

export function ServerProviders({ children }: ProvidersProps) {
  return (
    <ConvexAuthNextjsServerProvider>{children}</ConvexAuthNextjsServerProvider>
  );
}
