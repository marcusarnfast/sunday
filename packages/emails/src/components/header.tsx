import { Column, Img, Row, Section } from "@react-email/components";

export default function Header() {
  return (
    <Section className="py-6">
      <Row>
        <Column className="w-full">
          <Img
            alt="React Email logo"
            height="32"
            src="http://localhost:3000/static/logo.png"
          />
        </Column>
      </Row>
    </Section>
  );
}
