import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  userProfiles: defineTable({
    userId: v.id("users"),
    email: v.string(),
    name: v.optional(v.string()), // Optional - can use organization name instead
    role: v.union(v.literal("donor"), v.literal("receiver")),
    address: v.optional(v.string()), // Optional for backward compatibility
    zipCode: v.string(), // Keep for backward compatibility and filtering
    phone: v.optional(v.string()),
    organization: v.optional(v.string()),
    profilePictureUrl: v.optional(v.string()), // New: profile picture
  }).index("by_email", ["email"])
    .index("by_user_id", ["userId"]),

  listings: defineTable({
    donorId: v.id("userProfiles"),
    title: v.string(),
    description: v.string(),
    category: v.union(
      v.literal("prepared_food"),
      v.literal("produce"),
      v.literal("packaged_goods"),
      v.literal("baked_goods"),
      v.literal("other")
    ),
    quantity: v.optional(v.string()), // Keep for backward compatibility
    quantityNumber: v.optional(v.number()), // New: number of units available
    quantityUnit: v.optional(v.string()), // New: type of unit (serving, package, etc.)
    totalQuantity: v.optional(v.number()), // New: original total quantity
    availableQuantity: v.optional(v.number()), // New: remaining quantity available
    pickupTimeStart: v.number(),
    pickupTimeEnd: v.number(),
    address: v.optional(v.string()), // Optional for backward compatibility
    zipCode: v.string(), // Keep for filtering
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    photoUrl: v.optional(v.string()), // New: photo of the food
    source: v.optional(v.string()), // New: where the food is from (restaurant name, etc.)
    status: v.union(
      v.literal("active"),
      v.literal("claimed"),
      v.literal("completed"),
      v.literal("expired")
    ),
    claimedBy: v.optional(v.id("userProfiles")), // Keep for backward compatibility
    claimedAt: v.optional(v.number()),
  })
    .index("by_status", ["status"])
    .index("by_zip_and_status", ["zipCode", "status"])
    .index("by_donor", ["donorId"])
    .index("by_claimer", ["claimedBy"]),

  claims: defineTable({
    listingId: v.id("listings"),
    receiverId: v.id("userProfiles"),
    donorId: v.id("userProfiles"),
    quantityClaimed: v.optional(v.number()), // New: how many units this person claimed
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("rejected"),
      v.literal("completed")
    ),
    message: v.optional(v.string()),
  })
    .index("by_listing", ["listingId"])
    .index("by_receiver", ["receiverId"])
    .index("by_donor", ["donorId"]),

  messages: defineTable({
    claimId: v.id("claims"),
    senderId: v.id("userProfiles"),
    content: v.string(),
  }).index("by_claim", ["claimId"]),

  reports: defineTable({
    listingId: v.id("listings"),
    reporterId: v.id("userProfiles"),
    reason: v.union(
      v.literal("expired"),
      v.literal("inappropriate"),
      v.literal("spam"),
      v.literal("other")
    ),
    description: v.optional(v.string()),
    status: v.union(v.literal("pending"), v.literal("resolved")),
  })
    .index("by_listing", ["listingId"])
    .index("by_status", ["status"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
