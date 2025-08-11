"use client";

import { Badge } from "@sunday/ui/components/badge";
import { Button } from "@sunday/ui/components/button";
import { ChevronRight } from "lucide-react";

type Props = {
  isRead: boolean;
  timeAgo: string;
  message: string;
  title: string;
  onClick: () => void;
  onHover: () => void;
};

export function NotificationsRow({
  isRead,
  timeAgo,
  message,
  title,
  onClick,
  onHover,
}: Props) {
  return (
    <Button
      variant={"ghost"}
      mode={"card"}
      size={"none"}
      className="w-full h-full px-3 py-2 select-none flex items-center justify-between"
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onHover}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      role="button"
      tabIndex={0}
    >
      <div className="flex flex-col items-start flex-1 min-w-0">
        <p className="text-base font-semibold truncate">{title}</p>
        <p className="text-sm text-muted-foreground truncate">{message}</p>
      </div>

      <div className="flex flex-col items-end gap-1 self-start">
        <p className="text-xs text-muted-foreground">{timeAgo}</p>
        {isRead && (
          <Badge variant="secondary" size="sm">
            Read
          </Badge>
        )}
      </div>

      <ChevronRight className="size-6 text-muted-foreground -mr-2 flex-none" />
    </Button>
  );
}
