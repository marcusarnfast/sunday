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
    updatedAt: v.string(), // ISO 8601 format
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
    createdAt: v.string(), // ISO 8601 format
    updatedAt: v.string(), // ISO 8601 format
    houseId: v.id("houses"),
    inviterId: v.id("users"),
    inviteeEmail: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("declined"),
    ),
    acceptedAt: v.optional(v.string()), // ISO 8601 format
    declinedAt: v.optional(v.string()), // ISO 8601 format
  })
    .index("by_house", ["houseId"])
    .index("by_invitee_email", ["inviteeEmail"]),

  bookings: defineTable({
    createdAt: v.string(), // ISO 8601 format
    updatedAt: v.string(), // ISO 8601 format
    houseId: v.id("houses"),
    userId: v.id("users"),
    startDate: v.string(), // ISO 8601 format
    endDate: v.string(), // ISO 8601 format
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("declined"),
      v.literal("cancelled"),
    ),
    acceptedAt: v.optional(v.string()), // ISO 8601 format
    declinedAt: v.optional(v.string()), // ISO 8601 format
    cancelledAt: v.optional(v.string()), // ISO 8601 format
  })
    .index("by_house", ["houseId"])
    .index("by_user", ["userId"]),

  notifications: defineTable({
    createdAt: v.string(), // ISO 8601 format
    updatedAt: v.string(), // ISO 8601 format
    userId: v.id("users"),
    type: v.union(
      v.literal("invitation"),
      v.literal("invitation-response"),
      v.literal("booking"),
      v.literal("booking-response"),
    ),
    message: v.string(),
    metadata: v.optional(
      v.object({
        houseId: v.optional(v.id("houses")),
        bookingId: v.optional(v.id("bookings")),
        invitationId: v.optional(v.id("invitations")),
        status: v.optional(
          v.union(
            v.literal("pending"),
            v.literal("accepted"),
            v.literal("approved"),
            v.literal("declined"),
            v.literal("cancelled"),
          ),
        ),
      }),
    ),
    readAt: v.optional(v.string()), // ISO 8601 format
  })
    .index("by_user", ["userId"])
    .index("by_user_and_read_at", ["userId", "readAt"]),

  preferences: defineTable({
    userId: v.id("users"),
    emailNotifications: v.object({
      invitation: v.boolean(),
      invitationResponse: v.boolean(),
      booking: v.boolean(),
      bookingResponse: v.boolean(),
    }),
  }).index("by_user", ["userId"]),

  ...authTables,

  users: defineTable({
    createdAt: v.string(), // ISO 8601 format
    updatedAt: v.string(), // ISO 8601 format
    email: v.optional(v.string()),
    emailVerified: v.optional(v.boolean()),
    emailVerifiedAt: v.optional(v.string()), // ISO 8601 format
    name: v.string(),
    imageId: v.optional(v.id("_storage")),
    role: v.union(v.literal("default"), v.literal("admin")),
  }).index("by_email", ["email"]),
});

export default schema;
