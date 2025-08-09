import { Button } from "@sunday/ui/components/button";
import { Container } from "@sunday/ui/components/container";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <Container className="flex gap-6 h-full flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-center text-3xl font-bold">Welcome to sunday.</h1>
        <p className="text-center font-medium">
          Let&apos;s set up your account.
        </p>
      </div>
      <Button variant="secondary" asChild>
        <Link href="/onboarding/account">
          Get started
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </Container>
  );
}
