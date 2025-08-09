import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  storage: defineTable({
    storageId: v.id("_storage"),
    userId: v.id("users"),
    createdAt: v.string(), // ISO 8601 format
    filePath: v.string(), // Virtual folder so not "/test.png" but just "/"
    fileName: v.string(), // Just the filename
    fileType: v.string(),
    type: v.union(
      v.literal("temp"),
      v.literal("permanent"),
      v.literal("deleted"),
    ),
    expiresAt: v.optional(v.string()), // ISO 8601 format
  })
    .index("by_storage_id", ["storageId"])
    .index("by_user", ["userId"])
    .index("by_type", ["type"])
    .index("by_expires_at", ["expiresAt"]),
  houses: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    address: v.string(),
    imageId: v.optional(v.id("_storage")),
    ownerId: v.id("users"),
  }).index("by_owner", ["ownerId"]),

  memberships: defineTable({
    createdAt: v.string(), // ISO 8601 format (e.g., 2025-07-28T12:34:56Z)
    houseId: v.id("houses"),
    userId: v.id("users"),
    role: v.union(
      v.literal("owner"),
      v.literal("moderator"),
      v.literal("member"),
    ),
  })
    .index("by_house", ["houseId"])
    .index("by_user", ["userId"])
    .index("by_house_and_user", ["houseId", "userId"]),

  invitations: defineTable({
    houseId: v.id("houses"),
    invitedBy: v.id("users"),
    invitedUserEmail: v.string(),
    role: v.union(v.literal("moderator"), v.literal("member")),
    createdAt: v.string(), // ISO 8601 format
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("revoked"),
    ),
  })
    .index("by_house", ["houseId"])
    .index("by_invited_by", ["invitedBy"])
    .index("by_status", ["status"])
    .index("by_status_email", ["status", "invitedUserEmail"])
    .index("by_email", ["invitedUserEmail"]),

  bookings: defineTable({
    houseId: v.id("houses"),
    userId: v.id("users"),
    name: v.string(),
    note: v.optional(v.string()),
    startDate: v.string(), // ISO 8601 format
    endDate: v.string(), // ISO 8601 format
  })
    .index("by_house", ["houseId"])
    .index("by_user", ["userId"])
    .index("by_house_and_user", ["houseId", "userId"])
    .index("by_house_and_date", ["houseId", "startDate", "endDate"])
    .index("by_date", ["startDate", "endDate"]),
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    imageId: v.optional(v.id("_storage")),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    hasCompletedSetup: v.optional(v.boolean()),
  }).index("email", ["email"]),
});

export default schema;
