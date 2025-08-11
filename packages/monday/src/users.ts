import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";

export const init = internalMutation({
  args: { email: v.string(), emailVerified: v.optional(v.boolean()) },
  handler: async (ctx, { email, emailVerified }) => {
    return await ctx.db.insert("users", {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      email,
      emailVerified: emailVerified ?? false,
      emailVerifiedAt: emailVerified ? new Date().toISOString() : undefined,
      name:
        email.split("@")[0].charAt(0).toUpperCase() +
        email.split("@")[0].slice(1),
      role: "default",
    });
  },
});

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

export const getById = internalQuery({
  args: {
    id: v.id("users"),
  },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const getByEmail = internalQuery({
  args: {
    email: v.string(),
  },
  handler: async (ctx, { email }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
  },
});
