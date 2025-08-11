"use client";

import { api } from "@sunday/monday/api";
import type { Id } from "@sunday/monday/data-model";
import { Skeleton } from "@sunday/ui/components/skeleton";
import { useQuery } from "convex/react";
import { format } from "date-fns";
import { CheckIcon, XIcon } from "lucide-react";

type Props = {
  invitationId: Id<"invitations"> | undefined;
};

export function InvitationResponseNotification({ invitationId }: Props) {
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
    case "accepted":
      return (
        <Accepted
          email={invitation.inviteeEmail}
          acceptedAt={invitation.acceptedAt}
        />
      );
    case "declined":
      return (
        <Declined
          email={invitation.inviteeEmail}
          declinedAt={invitation.declinedAt}
        />
      );
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
  email: string;
  acceptedAt?: string;
};

export function Accepted({ email, acceptedAt }: AcceptedProps) {
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
          {email} joined{formattedDate ? ` on ${formattedDate}` : ""}.
        </p>
      </div>
    </div>
  );
}

type DeclinedProps = {
  email: string;
  declinedAt?: string;
};

export function Declined({ email, declinedAt }: DeclinedProps) {
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
          {email} declined{formattedDate ? ` on ${formattedDate}` : ""}.
        </p>
      </div>
    </div>
  );
}
