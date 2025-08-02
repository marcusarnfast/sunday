import {
  Body,
  CodeInline,
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

interface OtpEmailProps {
  token?: string;
}

export const OtpEmail = ({ token }: OtpEmailProps) => (
  <Tailwind>
    <Html>
      <Head>
        <ManropeFont />
      </Head>
      <Body>
        <Preview>Your login code for Sunday</Preview>
        <Container>
          <Header />
          <Heading className="text-2xl font-sans text-foreground font-semibold">
            Your login code for Sunday
          </Heading>
          <Text className="font-sans text-foreground">
            Use this code to verify your login on sunday.
          </Text>
          <CodeInline className="font-sans font-medium text-2xl rounded-lg bg-muted text-muted-foreground px-2 py-1">
            {token}
          </CodeInline>
          <Text className="font-sans text-foreground">
            It expires in 15 minutes.
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

OtpEmail.PreviewProps = {
  token: "123-456",
} as OtpEmailProps;

export default OtpEmail;
