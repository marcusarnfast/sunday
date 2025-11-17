import type { Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";

type LogActivityArgsProps = {
  houseId: Id<"houses">;
  type:
    | "task-created"
    | "task-updated"
    | "task-done"
    | "task-deleted"
    | "booking-created"
    | "booking-approved"
    | "booking-declined"
    | "booking-cancelled"
    | "invitation-sent"
    | "invitation-accepted"
    | "invitation-declined";
  actorId: Id<"users">;
  target: {
    taskId?: Id<"tasks">;
    bookingId?: Id<"bookings">;
    invitationId?: Id<"invitations">;
  };
  metadata?: Record<string, unknown>;
};

// Internal helper to log an activity
export const logActivity = async (
  ctx: MutationCtx,
  { houseId, type, actorId, target, metadata }: LogActivityArgsProps,
) => {
  await ctx.db.insert("activities", {
    createdAt: new Date().toISOString(),
    houseId,
    type,
    actorId,
    target,
    metadata,
  });
};
