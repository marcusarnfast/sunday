"use client";

import { cn } from "@sunday/ui/utils/cn";
import { InboxIcon, MailOpenIcon, PartyPopperIcon } from "lucide-react";

type EmptyVariant = "unread" | "read" | "all" | "default";

type EmptyStateProps = {
  title?: string;
  description?: string;
  className?: string;
  variant?: EmptyVariant;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  action?: React.ReactNode;
};

function getDefaultsByVariant(variant: EmptyVariant) {
  switch (variant) {
    case "unread":
      return {
        title: "You're all caught up",
        description:
          "No unread messages right now. New notifications will show up here.",
        Icon: InboxIcon,
      };
    case "read":
      return {
        title: "No read notifications yet",
        description: "Once you open notifications, they'll be listed here.",
        Icon: MailOpenIcon,
      };
    case "all":
      return {
        title: "No notifications yet",
        description:
          "When there's something new, it will appear in your inbox.",
        Icon: PartyPopperIcon,
      };
    default:
      return {
        title: "Nothing here yet",
        description:
          "When there's something new, it will appear in your inbox.",
        Icon: PartyPopperIcon,
      };
  }
}

export function EmptyState({
  title,
  description,
  className,
  variant,
  icon: IconOverride,
  action,
}: EmptyStateProps) {
  const { title: vt, description: vd, Icon } = getDefaultsByVariant(variant);
  const FinalIcon = IconOverride ?? Icon;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center gap-5 py-14 px-6",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border bg-muted/40 text-muted-foreground">
        <FinalIcon className="h-7 w-7" aria-hidden="true" />
      </div>
      <div className="space-y-1.5 max-w-sm">
        <p className="text-foreground font-semibold text-xl">{title ?? vt}</p>
        <p className="text-sm text-muted-foreground">{description ?? vd}</p>
      </div>
      {action ? <div className="pt-1">{action}</div> : null}
    </div>
  );
}
