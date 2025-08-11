import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "@sunday/monday/api";
import { preloadQuery } from "convex/nextjs";
import { AccountHeader } from "~/components/headers/account";
import { AccountTabs } from "~/components/tabs/account";

export default async function Page() {
  const token = await convexAuthNextjsToken();

  const [preloadedUser, preloadedPreferences] = await Promise.all([
    preloadQuery(api.users.getUser, {}, { token }),
    preloadQuery(api.preferences.getByUserId, {}, { token }),
  ]);

  return (
    <>
      <AccountHeader />
      <AccountTabs
        preloadedUser={preloadedUser}
        preloadedPreferences={preloadedPreferences}
      />
    </>
  );
}
