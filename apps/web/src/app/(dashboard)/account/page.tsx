import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "@sunday/monday/api";
import { Container } from "@sunday/ui/components/container";
import { preloadQuery } from "convex/nextjs";
import { AccountForm } from "~/components/forms/account";
import { AccountHeader } from "~/components/headers/account";

export default async function Page() {
  const token = await convexAuthNextjsToken();

  const preloadedUser = await preloadQuery(
    api.users.getUser,
    {},
    {
      token,
    },
  );

  return (
    <>
      <AccountHeader />
      <Container>
        <div className="max-w-xl">
          <AccountForm preloadedUser={preloadedUser} />
        </div>
      </Container>
    </>
  );
}
