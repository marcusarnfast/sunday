import { getAuthUserId } from "@convex-dev/auth/server";
import { internalMutation, internalQuery, query } from "@sunday/monday/server";
import { v } from "convex/values";

// Returns all memberships for a given house
export const getHouseMemberships = query({
	args: { houseId: v.id("houses") },
	handler: async (ctx, { houseId }) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) throw new Error("Not authenticated");

		const memberships = await ctx.db
			.query("memberships")
			.withIndex("by_house", (q) => q.eq("houseId", houseId))
			.collect();

		const results = await Promise.all(
			memberships.map(async (membership) => {
				const user = await ctx.db.get(membership.userId);
				return {
					id: membership._id,
					role: membership.role,
					email: user?.email ?? null,
				};
			}),
		);

		return results;
	},
});

export const getUserHouseMemberships = internalQuery({
	args: {
		houseId: v.id("houses"),
		userId: v.id("users"),
	},
	handler: async (ctx, { houseId, userId }) => {
		return await ctx.db
			.query("memberships")
			.withIndex("by_house_and_user", (q) =>
				q.eq("houseId", houseId).eq("userId", userId),
			)
			.first();
	},
});

export const createMembership = internalMutation({
	args: {
		houseId: v.id("houses"),
		userId: v.id("users"),
		role: v.union(
			v.literal("owner"),
			v.literal("moderator"),
			v.literal("member"),
		),
	},
	handler: async (ctx, { houseId, userId, role }) => {
		return await ctx.db.insert("memberships", {
			createdAt: new Date().toISOString(),
			houseId,
			userId,
			role,
		});
	},
});

export const updateMembership = internalMutation({
	args: {
		membershipId: v.id("memberships"),
		role: v.union(v.literal("moderator"), v.literal("member")),
	},
	handler: async (ctx, { membershipId, role }) => {
		await ctx.db.patch(membershipId, { role });
	},
});

export const deleteMembership = internalMutation({
	args: { membershipId: v.id("memberships") },
	handler: async (ctx, { membershipId }) => {
		return await ctx.db.delete(membershipId);
	},
});
