import { getAuthUserId } from "@convex-dev/auth/server";
import type { Id } from "@sunday/monday/data-model";
import { mutation, type QueryCtx, query } from "@sunday/monday/server";
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

// Delete file by id
export const deleteById = mutation({
	args: {
		storageId: v.id("_storage"),
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) {
			throw new Error("Not authenticated");
		}

		// So apperently convex doesn't really have reference fields, so if we delete this id then it doens't remove it from the referenced table...
		// I am just guessing here but to fix this am i doing cleanup...
		const refsToClean = [
			{ table: "houses", field: "imageId" },
			{ table: "users", field: "imageId" },
		];

		for (const { table, field } of refsToClean) {
			const docs = await ctx.db
				.query(table as any)
				.filter((q) => q.eq(q.field(field), args.storageId))
				.collect();

			for (const doc of docs) {
				await ctx.db.patch(doc._id, { [field]: undefined });
			}
		}

		return await ctx.storage.delete(args.storageId);
	},
});
