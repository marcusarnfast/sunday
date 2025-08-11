import { getAuthUserId } from "@convex-dev/auth/server";
import { internalMutation, query } from "@sunday/monday/server";
import { v } from "convex/values";

export const getUserNotifications = query({
  args: {
    status: v.optional(
      v.union(v.literal("unread"), v.literal("read"), v.literal("all")),
    ),
  },
  handler: async (ctx, { status }) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Not authenticated");
    }

    if (status === "unread") {
      return await ctx.db
        .query("notifications")
        .withIndex("by_user_and_read_at", (q) =>
          q.eq("userId", userId).eq("readAt", undefined),
        )
        .order("desc")
        .collect();
    }

    if (status === "read") {
      return await ctx.db
        .query("notifications")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .filter((q) => q.neq(q.field("readAt"), undefined))
        .order("desc")
        .collect();
    }

    return await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const getById = query({
  args: {
    id: v.id("notifications"),
  },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("_id"), id))
      .unique();
  },
});

export const createNotification = internalMutation({
  args: {
    userId: v.id("users"),
    type: v.union(
      v.literal("invitation"),
      v.literal("invitation-response"),
      v.literal("booking"),
      v.literal("booking-response"),
    ),
    message: v.string(),
    metadata: v.optional(
      v.object({
        houseId: v.optional(v.id("houses")),
        bookingId: v.optional(v.id("bookings")),
        invitationId: v.optional(v.id("invitations")),
        status: v.optional(
          v.union(
            v.literal("pending"),
            v.literal("accepted"),
            v.literal("approved"),
            v.literal("declined"),
            v.literal("cancelled"),
          ),
        ),
      }),
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("notifications", {
      ...args,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  },
});

export const updateNotification = internalMutation({
  args: {
    id: v.id("notifications"),
    readAt: v.optional(v.string()), // ISO 8601 format
    message: v.optional(v.string()),
    metadata: v.optional(
      v.object({
        houseId: v.optional(v.id("houses")),
        bookingId: v.optional(v.id("bookings")),
        invitationId: v.optional(v.id("invitations")),
        status: v.optional(
          v.union(
            v.literal("pending"),
            v.literal("accepted"),
            v.literal("approved"),
            v.literal("declined"),
            v.literal("cancelled"),
          ),
        ),
      }),
    ),
  },
  handler: async (ctx, { id, ...args }) => {
    return await ctx.db.patch(id, {
      ...args,
      updatedAt: new Date().toISOString(),
    });
  },
});
