import { Logo } from "../miscellaneous/logo";

type Props = {
  children: React.ReactNode;
};

export default function SetupLayout({
  children,
}: Props) {
  return (
    <div className="h-svh w-full bg-primary text-primary-foreground">
      <div className="absolute top-4 left-4">
        <Logo className="h-8 w-auto text-primary-foreground" />
      </div>
      {children}
      <div className="text-xs font-medium text-primary-foreground absolute bottom-4 left-4">
        Sunday © {new Date().getFullYear()}
      </div>
    </div>
  );
}