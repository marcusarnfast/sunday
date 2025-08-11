"use client";

import { api } from "@sunday/monday/api";
import { type Preloaded, useAction, usePreloadedQuery } from "convex/react";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { InvitationNotification } from "./invitation";
import { InvitationResponseNotification } from "./invitation-response";

type Props = {
  preloadedNotification: Preloaded<typeof api.notifications.getById>;
};

export function Notification({ preloadedNotification }: Props) {
  const notification = usePreloadedQuery(preloadedNotification);
  const markAsRead = useAction(api.actions.markAsRead);

  if (!notification) {
    return notFound();
  }

  useEffect(() => {
    if (notification.readAt) {
      return;
    }

    markAsRead({
      id: notification._id,
    });
  }, []);

  switch (notification.type) {
    case "invitation":
      return (
        <InvitationNotification
          invitationId={notification.metadata?.invitationId}
          message={notification.message}
        />
      );
    case "invitation-response":
      return (
        <InvitationResponseNotification
          invitationId={notification.metadata?.invitationId}
        />
      );
    case "booking":
      return <div>Booking notification</div>;
    default:
      return <div>Unknown notification type</div>;
  }
}
