import {
  Body,
  Head,
  Heading,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import Button from "./components/button";
import Container from "./components/container";
import { ManropeFont } from "./components/font";
import Footer from "./components/footer";
import Header from "./components/header";
import { Tailwind } from "./components/tailwind";

export const OnboardingEmail = () => (
  <Tailwind>
    <Html>
      <Head>
        <ManropeFont />
      </Head>
      <Body>
        <Preview>Thank you for signing up!</Preview>
        <Container>
          <Header />
          <Heading className="text-2xl font-sans text-foreground font-semibold">
            Welcome to Sunday
          </Heading>
          <Text className="font-sans text-foreground">Hi there,</Text>
          <Text className="font-sans text-foreground">
            Thanks for joining Sunday. You’re now set up to manage and enjoy
            your summerhouse without the usual back-and-forth.
          </Text>
          <Section>
            <Section className="my-4">
              <Row>
                <Text className="m-0 font-sans font-medium text-xl text-foreground leading-[28px]">
                  Why Use Sunday?
                </Text>
                <Text className="m-0 font-sans mt-[8px] text-muted-foreground leading-[24px]">
                  Sunday keeps your summerhouse bookings smooth, so you can
                  focus on enjoying it.
                </Text>
              </Row>
            </Section>
            <Section className="my-4">
              <Row>
                <Text className="m-0 font-sans font-medium text-lg text-foreground leading-[28px]">
                  Book your stays
                </Text>
                <Text className="m-0 font-sans mt-[8px] text-muted-foreground leading-[24px]">
                  Add your own bookings or request to stay at houses shared with
                  you. Owners can approve or cancel requests in one click.
                </Text>
              </Row>
            </Section>
            <Section className="my-4">
              <Row>
                <Text className="m-0 font-sans font-medium text-lg text-foreground leading-[28px]">
                  Stay in sync
                </Text>
                <Text className="m-0 font-sans mt-[8px] text-muted-foreground leading-[24px]">
                  Get notified when you or your guests visit starts and ends -
                  no need to remember or remind.
                </Text>
              </Row>
            </Section>
            <Section className="my-4">
              <Row>
                <Text className="m-0 font-sans font-medium text-lg text-foreground leading-[28px]">
                  Handle the details
                </Text>
                <Text className="m-0 font-sans mt-[8px] text-muted-foreground leading-[24px]">
                  Each house includes a shared to-do list. Everyone can see what
                  needs fixing, restocking, or preparing.
                </Text>
              </Row>
            </Section>
          </Section>
          <Section className="bg-primary h-[200px] my-12 rounded-2xl text-center">
            <Text className="font-sans text-xl font-semibold text-primary-foreground text-center">
              Get started with your first house
            </Text>

            <Button
              href="https://app.sunday.com"
              variant="secondary"
              size="sm"
              className="mt-4"
            >
              <Text className="font-sans text-primary">Open sunday →</Text>
            </Button>
          </Section>
          <Text className="font-sans text-foreground">
            We&apos;re here to help you get started. If you have any questions,
            please don&apos;t hesitate to reach out.
          </Text>
          <Text className="font-sans text-foreground leading-0">
            Cheers,
            <br />
            The Sunday Team
          </Text>
          <Footer />
        </Container>
      </Body>
    </Html>
  </Tailwind>
);

export default OnboardingEmail;
