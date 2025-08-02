import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internalGetFileById } from "./storage";

export const getUser = query({
	handler: async (ctx) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) {
			throw new Error("Not authenticated");
		}

		const user = await ctx.db.get(userId);

		if (!user) {
			throw new Error("User not found");
		}
		const image = await internalGetFileById(ctx, user.imageId);

		return {
			...user,
			image,
		};
	},
});

export const updateUser = mutation({
	args: {
		name: v.optional(v.string()),
		imageId: v.optional(v.id("_storage")),
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) {
			throw new Error("Not authenticated");
		}

		return await ctx.db.patch(userId, {
			name: args.name,
			imageId: args.imageId,
		});
	},
});
