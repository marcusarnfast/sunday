"use node";

import { getAuthUserId } from "@convex-dev/auth/server";
import { action } from "@sunday/monday/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { shouldSendEmail } from "./utils/preferences";

export const inviteHouseMember = action({
  args: {
    houseId: v.id("houses"),
    inviteeEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const { houseId, inviteeEmail } = args;

    // Authentication
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Validate house membership
    const { role } = await ctx.runQuery(
      internal.memberships.validateHouseMembership,
      {
        houseId,
      },
    );

    if (!["owner", "moderator"].includes(role)) {
      throw new Error("You are not authorized to invite members to this house");
    }

    // Get inviter
    const user = await ctx.runQuery(internal.users.getById, {
      id: userId,
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Get house
    const house = await ctx.runQuery(api.houses.getById, {
      id: houseId,
    });

    if (!house) {
      throw new Error("House not found");
    }

    // Create invitation
    const invitationId = await ctx.runMutation(
      internal.invitations.createInvitation,
      {
        houseId,
        inviteeEmail,
      },
    );

    // Get invitee
    const inviteeUser = await ctx.runQuery(internal.users.getByEmail, {
      email: inviteeEmail,
    });

    if (inviteeUser) {
      await ctx.runMutation(internal.notifications.createNotification, {
        userId: inviteeUser._id,
        type: "invitation",
        message: `You have been invited to join ${house.name} by ${user.name}`,
        metadata: {
          houseId,
          invitationId,
          status: "pending",
        },
      });

      if (await shouldSendEmail(ctx, inviteeUser._id, "invitation")) {
        await ctx.runAction(internal.emails.sendHouseInvitationEmail, {
          email: inviteeEmail,
          houseName: house.name,
          inviteeName: user.name ?? "",
        });
      }
    } else {
      await ctx.runAction(internal.emails.sendInvitationEmail, {
        inviteeEmail,
        inviterName: user.name ?? "",
        inviterEmail: user.email ?? "",
        houseName: house.name,
      });
    }

    return { success: true };
  },
});

export const acceptHouseInvitation = action({
  args: {
    invitationId: v.id("invitations"),
  },
  handler: async (ctx, args) => {
    const { invitationId } = args;

    // Authentication
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get invitation
    const invitation = await ctx.runQuery(api.invitations.getById, {
      id: invitationId,
    });
    if (!invitation) {
      throw new Error("Invitation not found");
    }

    // Validate invitation status
    if (invitation.status !== "pending") {
      throw new Error("Invitation not pending");
    }

    // Get user
    const user = await ctx.runQuery(internal.users.getById, { id: userId });
    if (!user) {
      throw new Error("User not found or missing email");
    }

    // Validate invitee
    if (invitation.inviteeEmail !== user.email) {
      throw new Error("You are not the invitee for this invitation");
    }

    // Get house
    const house = await ctx.runQuery(api.houses.getById, {
      id: invitation.houseId,
    });
    if (!house) {
      throw new Error("House not found");
    }

    // Accept invitation
    await ctx.runMutation(internal.invitations.acceptInvitation, {
      invitationId,
    });

    // Create membership
    await ctx.runMutation(internal.memberships.createMembership, {
      houseId: invitation.houseId,
      userId,
      role: "member",
    });

    // Get inviter
    const inviter = await ctx.runQuery(internal.users.getById, {
      id: invitation.inviterId,
    });

    if (!inviter) {
      throw new Error("Inviter not found");
    }

    // Create notification for inviter
    await ctx.runMutation(internal.notifications.createNotification, {
      userId: invitation.inviterId,
      type: "invitation-response",
      message: `${user.name ?? user.email} has accepted your invitation to join ${house.name}`,
      metadata: {
        houseId: invitation.houseId,
        invitationId,
        status: "accepted",
      },
    });

    if (inviter.email) {
      if (await shouldSendEmail(ctx, inviter._id, "invitationResponse")) {
        await ctx.runAction(internal.emails.sendHouseInvitationAcceptedEmail, {
          email: inviter.email,
          houseName: house.name,
          inviteeName: user.name ?? user.email,
        });
      }
    }
    return { success: true };
  },
});

export const declineHouseInvitation = action({
  args: {
    invitationId: v.id("invitations"),
  },
  handler: async (ctx, { invitationId }) => {
    // 1. Authentication
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // 2. Get invitation
    const invitation = await ctx.runQuery(api.invitations.getById, {
      id: invitationId,
    });
    if (!invitation) throw new Error("Invitation not found");

    // 3. Validate invitation status
    if (invitation.status !== "pending") {
      throw new Error("Invitation is not pending");
    }

    // 4. Get user (invitee)
    const user = await ctx.runQuery(internal.users.getById, { id: userId });
    if (!user || !user.email) {
      throw new Error("User not found or missing email");
    }

    // 5. Ensure the invitation is for this user
    if (invitation.inviteeEmail !== user.email) {
      throw new Error("You are not the invitee for this invitation");
    }

    // 6. Get house info
    const house = await ctx.runQuery(api.houses.getById, {
      id: invitation.houseId,
    });
    if (!house) throw new Error("House not found");

    // 7. Decline invitation (and set declinedAt)
    await ctx.runMutation(internal.invitations.declineInvitation, {
      invitationId,
    });

    // 8. Get inviter
    const inviter = await ctx.runQuery(internal.users.getById, {
      id: invitation.inviterId,
    });
    if (!inviter) throw new Error("Inviter not found");

    // 9. Create notification for inviter
    await ctx.runMutation(internal.notifications.createNotification, {
      userId: invitation.inviterId,
      type: "invitation-response",
      message: `${user.name ?? user.email} has declined your invitation to join ${house.name}`,
      metadata: {
        houseId: invitation.houseId,
        invitationId,
        status: "declined",
      },
    });

    // 10. Send email to inviter
    if (inviter.email) {
      if (await shouldSendEmail(ctx, inviter._id, "invitationResponse")) {
        await ctx.runAction(internal.emails.sendHouseInvitationDeclinedEmail, {
          email: inviter.email,
          houseName: house.name,
          inviteeName: user.name ?? user.email,
        });
      }
    }

    return { success: true };
  },
});

export const markAsRead = action({
  args: {
    id: v.id("notifications"),
  },
  handler: async (ctx, { id }) => {
    await ctx.runMutation(internal.notifications.updateNotification, {
      id,
      readAt: new Date().toISOString(),
    });
  },
});
