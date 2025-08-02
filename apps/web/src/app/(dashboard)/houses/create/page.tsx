import { Container } from "@sunday/ui/components/container";
import { Header, HeaderContent, HeaderTitle } from "@sunday/ui/components/header";
import { HouseForm } from "~/components/forms/house";

export default function Page() {
  return (
    <>
      <Header>
        <HeaderContent>
          <HeaderTitle>Create house</HeaderTitle>
        </HeaderContent>
      </Header>
      <Container>
        <HouseForm />
      </Container>
    </>
  );
}