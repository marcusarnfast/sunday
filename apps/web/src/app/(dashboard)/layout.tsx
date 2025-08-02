import { DashboardLayout } from "~/components/layouts/dashboard";

type LayoutProps = {
  children: React.ReactNode;
  breadcrumbs: React.ReactNode;
};

export default function Layout({ children, breadcrumbs }: LayoutProps) {
  return <DashboardLayout breadcrumbs={breadcrumbs}>{children}</DashboardLayout>;
}   