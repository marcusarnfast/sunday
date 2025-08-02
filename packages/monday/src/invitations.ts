import { getAuthUserId } from "@convex-dev/auth/server";
import { internalMutation, query } from "@sunday/monday/server";
import { v } from "convex/values";

export const listMyInvitations = query({
	args: { email: v.string() },
	handler: async (ctx, { email }) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) {
			throw new Error("Not authenticated");
		}

		return await ctx.db
			.query("invitations")
			.withIndex("by_status_email", (q) =>
				q.eq("status", "pending").eq("invitedUserEmail", email),
			)
			.collect();
	},
});

export const createInvitation = internalMutation({
	args: {
		houseId: v.id("houses"),
		invitedBy: v.id("users"),
		invitedUserEmail: v.string(),
		role: v.union(v.literal("moderator"), v.literal("member")),
	},
	handler: async (ctx, args) => {
		await ctx.db.insert("invitations", {
			...args,
			createdAt: new Date().toISOString(),
			status: "pending",
		});
	},
});

export const acceptInvitation = internalMutation({
	args: {
		userId: v.id("users"),
		invitedUserEmail: v.string(),
		houseId: v.id("houses"),
	},
	handler: async (ctx, args) => {
		const invite = await ctx.db
			.query("invitations")
			.withIndex("by_status_email", (q) =>
				q.eq("status", "pending").eq("invitedUserEmail", args.invitedUserEmail),
			)
			.filter((i) => i.eq(i.field("houseId"), args.houseId))
			.first();

		if (!invite) throw new Error("No valid invitation");

		await ctx.db.insert("memberships", {
			houseId: args.houseId,
			userId: args.userId,
			role: invite.role,
			createdAt: new Date().toISOString(),
		});

		await ctx.db.patch(invite._id, { status: "accepted" });
	},
});

export const revokeInvitation = internalMutation({
	args: {
		userId: v.id("users"),
		invitedUserEmail: v.string(),
		houseId: v.id("houses"),
	},
	handler: async (ctx, args) => {
		const invite = await ctx.db
			.query("invitations")
			.withIndex("by_status_email", (q) =>
				q.eq("status", "pending").eq("invitedUserEmail", args.invitedUserEmail),
			)
			.filter((i) => i.eq(i.field("houseId"), args.houseId))
			.first();

		if (!invite) throw new Error("No invite to revoke");

		await ctx.db.patch(invite._id, {
			status: "revoked",
		});
	},
});
