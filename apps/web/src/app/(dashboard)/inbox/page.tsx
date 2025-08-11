import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "@sunday/monday/api";
import { preloadQuery } from "convex/nextjs";
import { InboxHeader } from "~/components/headers/inbox";
import { InboxTabs } from "~/components/tabs/inbox";
import { loadInboxParams } from "~/hooks/use-inbox-params";

type Props = {
  searchParams: Promise<{ status: string }>;
};

export default async function Page({ searchParams }: Props) {
  const token = await convexAuthNextjsToken();
  const { status } = await loadInboxParams(searchParams);

  const preloadedNotifications = await preloadQuery(
    api.notifications.getUserNotifications,
    {
      status,
    },
    {
      token,
    },
  );

  return (
    <>
      <InboxHeader />
      <InboxTabs preloadedNotifications={preloadedNotifications} />
    </>
  );
}
