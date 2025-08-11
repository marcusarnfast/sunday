// convex/preferences.js

import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

export const getByUserId = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not found");
    }

    return await ctx.db
      .query("preferences")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
  },
});

export const init = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    await ctx.db.insert("preferences", {
      userId,
      emailNotifications: {
        invitation: true,
        invitationResponse: true,
        booking: true,
        bookingResponse: true,
      },
    });
  },
});

export const updatePreferences = mutation({
  args: {
    userId: v.id("users"),
    emailNotifications: v.object({
      invitation: v.boolean(),
      invitationResponse: v.boolean(),
      booking: v.boolean(),
      bookingResponse: v.boolean(),
    }),
  },
  handler: async (ctx, { userId, emailNotifications }) => {
    // Check if preferences already exist for this user
    const existing = await ctx.db
      .query("preferences")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (existing) {
      // Update existing preferences
      await ctx.db.patch(existing._id, { emailNotifications });
    } else {
      // Create new preferences record
      await ctx.db.insert("preferences", {
        userId,
        emailNotifications,
      });
    }

    return await ctx.db
      .query("preferences")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
  },
});
