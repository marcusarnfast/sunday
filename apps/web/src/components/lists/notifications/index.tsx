"use client";

import type { api } from "@sunday/monday/api";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { useInboxParams } from "~/hooks/use-inbox-params";
import { getTitle } from "~/utils/notification-title";
import { EmptyState } from "./empty-state";
import { NotificationsRow } from "./row";

type Props = {
  preloadedNotifications: Preloaded<
    typeof api.notifications.getUserNotifications
  >;
};

export function NotificationsList({ preloadedNotifications }: Props) {
  const {
    params: { status },
  } = useInboxParams();
  const notifications = usePreloadedQuery(preloadedNotifications);
  const router = useRouter();

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <EmptyState variant={status} />
      </div>
    );
  }

  return (
    <div className="divide-y">
      {notifications.map((n) => {
        const isRead = !!n.readAt;
        const timeAgo = formatDistanceToNow(new Date(n.createdAt), {
          addSuffix: true,
        });
        const title = getTitle(n.type);

        return (
          <div className="py-2" key={n._id}>
            <NotificationsRow
              isRead={isRead}
              timeAgo={timeAgo}
              message={n.message}
              title={title}
              onClick={() => {
                router.push(`/inbox/${n._id}`);
              }}
              onHover={() => {
                router.prefetch(`/inbox/${n._id}`);
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
