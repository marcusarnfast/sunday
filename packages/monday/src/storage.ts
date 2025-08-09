import { getAuthUserId } from "@convex-dev/auth/server";
import type { Id } from "@sunday/monday/data-model";
import {
  internalMutation,
  mutation,
  type QueryCtx,
  query,
} from "@sunday/monday/server";
import { v } from "convex/values";

// Generate upload url
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.storage.generateUploadUrl();
  },
});

// Create a new storage item
export const create = mutation({
  args: {
    storageId: v.id("_storage"),
    fileName: v.string(),
    fileType: v.string(),
    filePath: v.string(),
    expiresAt: v.optional(v.string()),
    type: v.optional(v.union(v.literal("temp"), v.literal("permanent"))),
  },
  handler: async (ctx, args) => {
    const {
      storageId,
      fileName,
      fileType,
      filePath,
      expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24 hours
      type = "temp",
    } = args;
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Not authenticated");
    }

    if (expiresAt) {
      const expiresAtDate = new Date(expiresAt);
      if (expiresAtDate < new Date()) {
        throw new Error("Expires at date is in the past");
      }
    }

    return await ctx.db.insert("storage", {
      storageId,
      userId,
      createdAt: new Date().toISOString(),
      expiresAt,
      fileName,
      fileType,
      filePath,
      type,
    });
  },
});

export const save = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const { storageId } = args;
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Not authenticated");
    }

    const file = await ctx.db
      .query("storage")
      .filter((q) => q.eq(q.field("storageId"), storageId))
      .first();

    if (!file) {
      throw new Error("File not found");
    }

    if (file.userId !== userId) {
      throw new Error("Not authorized");
    }

    return await ctx.db.patch(file._id, {
      type: "permanent",
      expiresAt: undefined,
    });
  },
});

export const updateType = internalMutation({
  args: {
    storageId: v.id("_storage"),
    type: v.union(
      v.literal("temp"),
      v.literal("permanent"),
      v.literal("deleted"),
    ),
    expiresAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { storageId, type, expiresAt } = args;

    const file = await ctx.db
      .query("storage")
      .withIndex("by_storage_id", (q) => q.eq("storageId", storageId))
      .unique();

    if (!file) {
      throw new Error("File not found");
    }

    return await ctx.db.patch(file._id, {
      type,
      expiresAt,
    });
  },
});

export const cleanupFiles = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = new Date().toISOString();

    const filesToDelete = await ctx.db
      .query("storage")
      .filter((q) =>
        q.or(
          q.and(q.eq(q.field("type"), "temp"), q.lt(q.field("expiresAt"), now)),
          q.and(
            q.eq(q.field("type"), "deleted"),
            q.lt(q.field("expiresAt"), now),
          ),
        ),
      )
      .collect();

    for (const file of filesToDelete) {
      try {
        await ctx.storage.delete(file.storageId);
        await ctx.db.delete(file._id);
      } catch (err) {
        console.error(`Failed to delete file ${file._id}:`, err);
      }
    }

    return { deletedCount: filesToDelete.length };
  },
});

// Get file url
export const getById = query({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, { storageId }) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Not authenticated");
    }

    const file = await ctx.db
      .query("storage")
      .filter((q) => q.eq(q.field("storageId"), storageId))
      .first();

    if (!file) {
      throw new Error("File not found");
    }

    if (file.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const fileUrl = await ctx.storage.getUrl(storageId);

    if (!fileUrl) {
      throw new Error("File url not found");
    }

    return {
      id: file._id,
      storageId: file.storageId,
      fileName: file.fileName,
      fileType: file.fileType,
      filePath: file.filePath,
      type: file.type,
      url: fileUrl,
    };
  },
});

export async function internalGetFileById(
  ctx: QueryCtx,
  storageId: Id<"_storage"> | undefined,
) {
  if (!storageId) {
    return null;
  }

  const [file, fileUrl] = await Promise.all([
    ctx.db.system.get(storageId),
    ctx.storage.getUrl(storageId),
  ]);

  if (!file || !fileUrl) {
    throw new Error("File not found");
  }

  return {
    id: file._id,
    name: file._id,
    size: file.size,
    type: file.contentType,
    url: fileUrl,
  };
}

// Get all files
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.system.query("_storage").collect();
  },
});
