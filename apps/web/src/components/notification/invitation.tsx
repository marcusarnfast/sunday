"use client";

import { api } from "@sunday/monday/api";
import type { Id } from "@sunday/monday/data-model";
import { Button } from "@sunday/ui/components/button";
import { Skeleton } from "@sunday/ui/components/skeleton";
import { useAction, useQuery } from "convex/react";
import { format } from "date-fns";
import {
  CheckIcon,
  MessageCircleReplyIcon,
  UserPlusIcon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";

type Props = {
  invitationId: Id<"invitations"> | undefined;
  message: string | undefined;
};

export function InvitationNotification({ invitationId, message }: Props) {
  const invitation = useQuery(
    api.invitations.getById,
    invitationId
      ? {
          id: invitationId,
        }
      : "skip",
  );

  if (!invitation) return <Loading />;

  switch (invitation.status) {
    case "pending":
      return <Pending invitationId={invitation._id} message={message} />;
    case "accepted":
      return <Accepted acceptedAt={invitation.acceptedAt} />;
    case "declined":
      return <Declined declinedAt={invitation.declinedAt} />;
    default:
      return <Loading />;
  }
}

export function Loading() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-14 px-6">
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="space-y-1.5 max-w-sm flex flex-col items-center">
        <Skeleton className="h-[28px] w-48 rounded-none" />
        <Skeleton className="h-[20px] w-64 rounded-none" />
      </div>
    </div>
  );
}

type AcceptedProps = {
  acceptedAt?: string;
};

export function Accepted({ acceptedAt }: AcceptedProps) {
  const date = acceptedAt ? new Date(acceptedAt) : null;
  const formattedDate = date ? format(date, "PPP") : null;

  return (
    <div className="flex flex-col items-center justify-center text-center gap-5 py-14 px-6">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10 text-green-500">
        <CheckIcon className="size-8" />
      </div>
      <div className="space-y-1.5 max-w-sm">
        <p className="text-foreground font-semibold text-xl">
          Invitation Accepted
        </p>
        <p className="text-sm text-muted-foreground">
          You joined{formattedDate ? ` on ${formattedDate}` : ""}.
        </p>
      </div>
    </div>
  );
}

type DeclinedProps = {
  declinedAt?: string;
};

export function Declined({ declinedAt }: DeclinedProps) {
  const date = declinedAt ? new Date(declinedAt) : null;
  const formattedDate = date ? format(date, "PPP") : null;

  return (
    <div className="flex flex-col items-center justify-center text-center gap-5 py-14 px-6">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-500">
        <XIcon className="size-8" />
      </div>
      <div className="space-y-1.5 max-w-sm">
        <p className="text-foreground font-semibold text-xl">
          Invitation Declined
        </p>
        <p className="text-sm text-muted-foreground">
          You declined{formattedDate ? ` on ${formattedDate}` : ""}.
        </p>
      </div>
    </div>
  );
}

type PendingProps = {
  invitationId: Id<"invitations">;
  message: string | undefined;
};

function Pending({ invitationId, message }: PendingProps) {
  const acceptInvitation = useAction(api.actions.acceptHouseInvitation);
  const declineInvitation = useAction(api.actions.declineHouseInvitation);

  const handleAccept = async () => {
    toast.promise(acceptInvitation({ invitationId }), {
      loading: "Accepting invitation...",
      success: "Invitation accepted",
      error: "Failed to accept invitation",
    });
  };

  const handleDecline = async () => {
    toast.promise(declineInvitation({ invitationId }), {
      loading: "Declining invitation...",
      success: "Invitation declined",
      error: "Failed to decline invitation",
    });
  };
  return (
    <div className="flex flex-col items-center justify-center text-center gap-5 py-14 px-6">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
        <MessageCircleReplyIcon className="size-8" />
      </div>
      <div className="space-y-1.5 max-w-sm">
        <p className="text-foreground font-semibold text-xl">
          Invitation Pending
        </p>
        <p className="text-sm text-muted-foreground">{message}</p>
        <div className="flex flex-col gap-2 mx-auto items-center justify-center mt-6 w-[200px]">
          <Button
            variant="default"
            size="sm"
            className="w-full"
            onClick={handleAccept}
          >
            Accept <UserPlusIcon />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleDecline}
          >
            Decline <XIcon />
          </Button>
          <Button variant="outline" size="sm" className="w-full">
            Testing
            <XIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
