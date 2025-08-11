import {
  Body,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import Container from "./components/container";
import { ManropeFont } from "./components/font";
import Footer from "./components/footer";
import Header from "./components/header";
import { Tailwind } from "./components/tailwind";

interface HouseInvitationEmailProps {
  houseName: string;
  inviteeName: string;
}

export const HouseInvitationEmail = ({
  houseName,
  inviteeName,
}: HouseInvitationEmailProps) => (
  <Tailwind>
    <Html>
      <Head>
        <ManropeFont />
      </Head>
      <Body>
        <Preview>You have been invited to {houseName}</Preview>
        <Container>
          <Header />
          <Heading className="text-2xl font-sans text-foreground font-semibold">
            You have been invited to {houseName}
          </Heading>
          <Text className="font-sans text-foreground">
            You have been invited to {houseName} by {inviteeName}.
          </Text>
          <Text className="font-sans text-foreground">
            If you didn&apos;t request this, ignore the email.
          </Text>
          <Footer />
        </Container>
      </Body>
    </Html>
  </Tailwind>
);

HouseInvitationEmail.PreviewProps = {
  houseName: "My House",
  inviteeName: "John Doe",
} as HouseInvitationEmailProps;

export default HouseInvitationEmail;
