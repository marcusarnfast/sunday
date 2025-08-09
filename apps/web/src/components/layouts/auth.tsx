import { Logo } from "../miscellaneous/logo";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background" data-layout="auth">
      <div className="flex-1 p-4 max-w-lg mx-auto flex flex-col justify-between">
        <div className="flex items-start p-2">
          <Logo className="h-8 w-auto" />
        </div>

        {children}
        <div className="text-xs font-medium text-muted-foreground">
          Sunday © {new Date().getFullYear()}
        </div>
      </div>
      <div className="flex-1 p-2 hidden md:block relative">
        <div className="relative size-full rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-primary"></div>
        </div>
      </div>
    </div>
  );
}
