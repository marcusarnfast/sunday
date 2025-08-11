import { getAuthUserId } from "@convex-dev/auth/server";
import { internalMutation, query } from "@sunday/monday/server";
import { v } from "convex/values";

export const getById = query({
  args: {
    id: v.id("invitations"),
  },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.get(id);
  },
});

export const createInvitation = internalMutation({
  args: {
    houseId: v.id("houses"),
    inviteeEmail: v.string(),
  },
  handler: async (ctx, { houseId, inviteeEmail }) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Not authenticated");
    }

    const invitationId = await ctx.db.insert("invitations", {
      houseId,
      inviteeEmail,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      inviterId: userId,
      status: "pending",
    });

    return invitationId;
  },
});

export const acceptInvitation = internalMutation({
  args: {
    invitationId: v.id("invitations"),
  },
  handler: async (ctx, { invitationId }) => {
    return await ctx.db.patch(invitationId, {
      updatedAt: new Date().toISOString(),
      acceptedAt: new Date().toISOString(),
      status: "accepted",
    });
  },
});

export const declineInvitation = internalMutation({
  args: {
    invitationId: v.id("invitations"),
  },
  handler: async (ctx, { invitationId }) => {
    return await ctx.db.patch(invitationId, {
      updatedAt: new Date().toISOString(),
      declinedAt: new Date().toISOString(),
      status: "declined",
    });
  },
});
