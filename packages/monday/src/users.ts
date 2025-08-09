import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const getUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.get(userId);
  },
});

export const updateUser = mutation({
  args: {
    _id: v.optional(v.id("users")),
    name: v.optional(v.string()),
    imageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Not authenticated");
    }

    let imageForDeletion: Id<"_storage"> | null = null;

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    imageForDeletion = user.imageId ?? null;

    await ctx.db.patch(userId, {
      name: args.name,
      imageId: args.imageId,
    });

    if (args.imageId) {
      await ctx.runMutation(internal.storage.updateType, {
        storageId: args.imageId,
        type: "permanent",
        expiresAt: undefined,
      });
    }

    if (imageForDeletion) {
      await ctx.runMutation(internal.storage.updateType, {
        storageId: imageForDeletion,
        type: "deleted",
        expiresAt: new Date().toISOString(),
      });
    }

    return await ctx.db.get(userId);
  },
});
