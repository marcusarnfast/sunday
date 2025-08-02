import { AuthLayout } from "~/components/layouts/auth";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return <AuthLayout>{children}</AuthLayout>;
}   