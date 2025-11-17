import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { generateKeyBetween } from "jittered-fractional-indexing";
import { mutation, query } from "./_generated/server";
import { logActivity } from "./activities";

export const getTasksByHouseId = query({
  args: {
    houseId: v.id("houses"),
    status: v.optional(v.union(v.literal("pending"), v.literal("done"))),
  },
  handler: async (ctx, args) => {
    let q = ctx.db
      .query("tasks")
      .withIndex("by_house", (q) => q.eq("houseId", args.houseId));

    if (args.status) {
      q = q.filter((q) => q.eq(q.field("status"), args.status));
    }

    const tasks = await q.collect();

    return tasks.sort((a, b) => {
      if (a.sortOrder != null && b.sortOrder != null) {
        return a.sortOrder.localeCompare(b.sortOrder);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  },
});

// Create a new task
export const createTask = mutation({
  args: {
    houseId: v.id("houses"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const now = new Date().toISOString();

    const firstTask = await ctx.db
      .query("tasks")
      .withIndex("by_house_and_sort_order", (q) =>
        q.eq("houseId", args.houseId),
      )
      .order("asc")
      .first();
    const sortOrder = generateKeyBetween(null, firstTask?.sortOrder ?? null);

    const taskId = await ctx.db.insert("tasks", {
      createdAt: now,
      updatedAt: now,
      houseId: args.houseId,
      title: args.title,
      status: "pending",
      createdBy: userId,
      doneBy: undefined,
      sortOrder,
    });

    await logActivity(ctx, {
      houseId: args.houseId,
      type: "task-created",
      actorId: userId,
      target: { taskId },
      metadata: {
        new: {
          ...args,
          sortOrder,
        },
      },
    });

    return taskId;
  },
});

// Update a task (e.g., mark as done or change title)
export const updateTask = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    status: v.optional(v.union(v.literal("pending"), v.literal("done"))),
    doneBy: v.optional(v.id("users")),
    houseId: v.optional(v.id("houses")),
    sortOrder: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const task = await ctx.db.get(args.id);
    if (!task) throw new Error("Task not found");

    const now = new Date().toISOString();

    // ✅ If sortOrder is being updated, ensure it's valid
    const newSortOrder = args.sortOrder ?? task.sortOrder;
    if (args.sortOrder && task.sortOrder && args.sortOrder === task.sortOrder) {
      // No change
    }

    await ctx.db.patch(args.id, {
      doneBy: args.doneBy ?? task.doneBy,
      sortOrder: newSortOrder,
      createdAt: task.createdAt,
      updatedAt: now,
      houseId: args.houseId ?? task.houseId,
      status: args.status ?? task.status,
      title: args.title ?? task.title,
    });

    await logActivity(ctx, {
      houseId: task.houseId,
      type: "task-updated",
      actorId: userId,
      target: { taskId: args.id },
      metadata: {
        old: task,
        new: { ...task, ...args },
      },
    });
  },
});

// Delete a task
export const deleteTask = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Task not found");

    await ctx.db.delete(args.taskId);

    await logActivity(ctx, {
      houseId: task.houseId,
      type: "task-deleted",
      actorId: userId,
      target: { taskId: args.taskId },
      metadata: {
        old: task,
      },
    });
  },
});
