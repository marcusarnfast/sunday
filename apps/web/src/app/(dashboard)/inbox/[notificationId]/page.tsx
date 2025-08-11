import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "@sunday/monday/api";
import type { Id } from "@sunday/monday/data-model";
import { Container } from "@sunday/ui/components/container";
import { preloadQuery } from "convex/nextjs";
import { NotificationHeader } from "~/components/headers/notification";
import { Notification } from "~/components/notification";

type Props = {
  params: Promise<{ notificationId: Id<"notifications"> }>;
};

export default async function Page({ params }: Props) {
  const { notificationId } = await params;
  const token = await convexAuthNextjsToken();

  const preloadedNotification = await preloadQuery(
    api.notifications.getById,
    {
      id: notificationId,
    },
    {
      token,
    },
  );

  return (
    <>
      <NotificationHeader preloadedNotification={preloadedNotification} />
      <Container>
        <Notification preloadedNotification={preloadedNotification} />
      </Container>
    </>
  );
}
