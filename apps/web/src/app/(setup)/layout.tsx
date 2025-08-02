import SetupLayout from "~/components/layouts/setup";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return <SetupLayout>{children}</SetupLayout>;
}