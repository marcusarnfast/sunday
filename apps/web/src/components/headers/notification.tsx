"use client";

import type { api } from "@sunday/monday/api";
import {
  Header,
  HeaderContent,
  HeaderTitle,
} from "@sunday/ui/components/header";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import { getTitle } from "~/utils/notification-title";

type NotificationHeaderProps = {
  preloadedNotification: Preloaded<typeof api.notifications.getById>;
};

export function NotificationHeader({
  preloadedNotification,
}: NotificationHeaderProps) {
  const notification = usePreloadedQuery(preloadedNotification);

  if (!notification) return null;

  const title = getTitle(notification.type);

  return (
    <Header>
      <HeaderContent>
        <HeaderTitle>{title}</HeaderTitle>
      </HeaderContent>
    </Header>
  );
}
