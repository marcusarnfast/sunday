"use node";

import { getAuthUserId } from "@convex-dev/auth/server";
import { action } from "@sunday/monday/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const inviteHouseMember = action({
	args: {
		houseId: v.id("houses"),
		email: v.string(),
		role: v.union(v.literal("moderator"), v.literal("member")),
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) throw new Error("Not authenticated");

		const membership = await ctx.runQuery(
			internal.memberships.getUserHouseMemberships,
			{
				houseId: args.houseId,
				userId,
			},
		);

		if (!membership || membership.role === "member") {
			throw new Error("Not allowed");
		}

		await ctx.runMutation(internal.invitations.createInvitation, {
			houseId: args.houseId,
			invitedBy: userId,
			invitedUserEmail: args.email,
			role: args.role,
		});

		await ctx.runAction(internal.emails.sendInviteEmail, {
			email: args.email,
			houseName: "Test House",
		});
	},
});

export const acceptHouseInvitation = action({
	args: {
		houseId: v.id("houses"),
		email: v.string(),
	},
	handler: async (ctx, { houseId, email }) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) throw new Error("Not authenticated");

		await ctx.runMutation(internal.invitations.acceptInvitation, {
			userId,
			invitedUserEmail: email,
			houseId,
		});
	},
});

export const revokeHouseInvitation = action({
	args: {
		houseId: v.id("houses"),
		email: v.string(),
	},
	handler: async (ctx, { houseId, email }) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) throw new Error("Not authenticated");

		const membership = await ctx.runQuery(
			internal.memberships.getUserHouseMemberships,
			{
				houseId,
				userId,
			},
		);

		if (!membership || membership.role === "member") {
			throw new Error("Not allowed");
		}

		await ctx.runMutation(internal.invitations.revokeInvitation, {
			houseId,
			invitedUserEmail: email,
			userId,
		});
	},
});

export const updateHouseMember = action({
	args: {
		houseId: v.id("houses"),
		membershipId: v.id("memberships"),
		newRole: v.union(v.literal("member"), v.literal("moderator")),
	},
	handler: async (ctx, { houseId, membershipId, newRole }) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) throw new Error("Not authenticated");

		const membership = await ctx.runQuery(
			internal.memberships.getUserHouseMemberships,
			{
				houseId,
				userId,
			},
		);

		if (!membership) throw new Error("Membership not found");
		if (membership.role === "owner") throw new Error("Cannot update owner");

		// const callerMembership = await ctx.db
		// 	.query("memberships")
		// 	.withIndex("by_house_and_user", (q) =>
		// 		q.eq("houseId", membership.houseId).eq("userId", userId),
		// 	)
		// 	.first();

		// if (!callerMembership || callerMembership.role === "member") {
		// 	throw new Error("Not allowed");
		// }

		await ctx.runMutation(internal.memberships.updateMembership, {
			membershipId,
			role: newRole,
		});
	},
});
