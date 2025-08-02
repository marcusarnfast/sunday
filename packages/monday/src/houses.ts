import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "@sunday/monday/server";
import { v } from "convex/values";
import { internalGetFileById } from "./storage";

export const getUserHouses = query({
	args: {},
	handler: async (ctx) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) {
			throw new Error("Not authenticated");
		}

		const memberships = await ctx.db
			.query("memberships")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect();

		if (memberships.length === 0) {
			return [];
		}

		const houses = await Promise.all(
			memberships.map(async (membership) => {
				const house = await ctx.db.get(membership.houseId);
				if (!house) return undefined;

				const owner = await ctx.db.get(house.ownerId);

				const image = await internalGetFileById(ctx, house.imageId);

				return {
					...house,
					ownerName: owner?.name || owner?.email || "Unknown",
					userRole: membership.role,
					image,
				};
			}),
		);

		// Filter out any undefined (missing house) but always return an array
		return houses.filter((h) => h !== undefined);
	},
});

export const getById = query({
	args: {
		id: v.id("houses"),
	},
	handler: async (ctx, args) => {
		const house = await ctx.db.get(args.id);
		if (!house) {
			return null;
		}
		const image = await internalGetFileById(ctx, house.imageId);

		return {
			...house,
			image,
		};
	},
});

// Create a new house
export const createHouse = mutation({
	args: {
		name: v.string(),
		description: v.optional(v.string()),
		address: v.string(),
		imageId: v.optional(v.id("_storage")),
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) {
			throw new Error("Not authenticated");
		}

		const houseId = await ctx.db.insert("houses", {
			name: args.name,
			description: args.description,
			address: args.address,
			imageId: args.imageId,
			ownerId: userId,
		});

		await ctx.db.insert("memberships", {
			houseId,
			userId,
			role: "owner",
			createdAt: new Date().toISOString(),
		});

		return houseId;
	},
});

// Update a house (only owner can do this)
export const updateHouse = mutation({
	args: {
		id: v.id("houses"),
		name: v.string(),
		description: v.optional(v.string()),
		address: v.optional(v.string()),
		imageId: v.optional(v.id("_storage")),
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) {
			throw new Error("Not authenticated");
		}

		const house = await ctx.db.get(args.id);
		if (!house) {
			throw new Error("House not found");
		}

		if (house.ownerId !== userId) {
			throw new Error("Only the owner can update the house");
		}

		await ctx.db.patch(args.id, {
			name: args.name,
			description: args.description,
			address: args.address,
			imageId: args.imageId,
		});
	},
});

// Delete a house (only owner can do this)
export const deleteHouse = mutation({
	args: {
		id: v.id("houses"),
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) {
			throw new Error("Not authenticated");
		}

		const house = await ctx.db.get(args.id);
		if (!house) {
			throw new Error("House not found");
		}

		if (house.ownerId !== userId) {
			throw new Error("Only the owner can delete the house");
		}

		// Delete all memberships
		const memberships = await ctx.db
			.query("memberships")
			.withIndex("by_house", (q) => q.eq("houseId", args.id))
			.collect();

		for (const membership of memberships) {
			await ctx.db.delete(membership._id);
		}

		// Delete all bookings
		const bookings = await ctx.db
			.query("bookings")
			.withIndex("by_house", (q) => q.eq("houseId", args.id))
			.collect();

		for (const booking of bookings) {
			await ctx.db.delete(booking._id);
		}

		// Delete the house
		await ctx.db.delete(args.id);
	},
});
