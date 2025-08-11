"use client";

import type { api } from "@sunday/monday/api";
import { Container } from "@sunday/ui/components/container";
import { Tabs, TabsContent } from "@sunday/ui/components/tabs";
import type { Preloaded } from "convex/react";
import { useInboxParams } from "~/hooks/use-inbox-params";
import { NotificationsList } from "../lists/notifications";

type InboxTabsProps = {
  preloadedNotifications: Preloaded<
    typeof api.notifications.getUserNotifications
  >;
};

export function InboxTabs({ preloadedNotifications }: InboxTabsProps) {
  const { params } = useInboxParams();
  const { status } = params;

  return (
    <Tabs value={status}>
      <Container>
        <TabsContent value="all">
          <NotificationsList preloadedNotifications={preloadedNotifications} />
        </TabsContent>
        <TabsContent value="unread">
          <NotificationsList preloadedNotifications={preloadedNotifications} />
        </TabsContent>
        <TabsContent value="read">
          <NotificationsList preloadedNotifications={preloadedNotifications} />
        </TabsContent>
      </Container>
    </Tabs>
  );
}
