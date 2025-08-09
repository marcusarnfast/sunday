import { Container as ContainerComponent } from "@react-email/components";

type ContainerProps = {
  children: React.ReactNode;
};

export default function Container({ children }: ContainerProps) {
  return (
    <ContainerComponent className="max-w-[560px] mx-auto px-6 py-[20px] bg-background">
      {children}
    </ContainerComponent>
  );
}
