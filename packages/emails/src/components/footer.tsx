import { Hr, Section, Text } from "@react-email/components";

export default function Footer() {
  return (
    <Section>
      <Hr className="border-border" />
      <Text className="font-sans text-xs text-muted-foreground">
        Sunday © {new Date().getFullYear()}
      </Text>
    </Section>
  );
}
