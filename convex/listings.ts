import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

export const createListing = mutation({
  args: {
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
    quantityNumber: v.number(), // New: number of units
    quantityUnit: v.string(), // New: type of unit
    pickupTimeStart: v.number(),
    pickupTimeEnd: v.number(),
    address: v.string(), // Required for new listings
    zipCode: v.string(),
    source: v.optional(v.string()), // New: food source
    photoUrl: v.optional(v.string()), // New: photo URL/ID
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (!userProfile || userProfile.role !== "donor") {
      throw new Error("Only donors can create listings");
    }

    const listingId = await ctx.db.insert("listings", {
      donorId: userProfile._id,
      title: args.title,
      description: args.description,
      category: args.category,
      quantity: args.quantity || `${args.quantityNumber} ${args.quantityUnit}`, // Backward compatibility
      quantityNumber: args.quantityNumber,
      quantityUnit: args.quantityUnit,
      totalQuantity: args.quantityNumber,
      availableQuantity: args.quantityNumber,
      pickupTimeStart: args.pickupTimeStart,
      pickupTimeEnd: args.pickupTimeEnd,
      address: args.address,
      zipCode: args.zipCode,
      source: args.source,
      photoUrl: args.photoUrl,
      status: "active",
    });

    // Schedule expiration after 48 hours
    await ctx.scheduler.runAfter(48 * 60 * 60 * 1000, internal.listings.expireListing, {
      listingId,
    });

    return listingId;
  },
});

export const getListings = query({
  args: {
    zipCode: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let listings;

    if (args.zipCode) {
      listings = await ctx.db
        .query("listings")
        .withIndex("by_zip_and_status", (q) =>
          q.eq("zipCode", args.zipCode!).eq("status", "active")
        )
        .order("desc")
        .take(50);
    } else {
      listings = await ctx.db
        .query("listings")
        .withIndex("by_status", (q) => q.eq("status", "active"))
        .order("desc")
        .take(50);
    }

    const listingsWithDonor = await Promise.all(
      listings.map(async (listing) => {
        const donor = await ctx.db.get(listing.donorId);
        return {
          ...listing,
          donor: donor ? { name: donor.name, organization: donor.organization } : null,
        };
      })
    );

    if (args.category && args.category !== "all") {
      return listingsWithDonor.filter((listing) => listing.category === args.category);
    }

    return listingsWithDonor;
  },
});

export const getMyListings = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (!userProfile) {
      return [];
    }

    return await ctx.db
      .query("listings")
      .withIndex("by_donor", (q) => q.eq("donorId", userProfile._id))
      .order("desc")
      .collect();
  },
});

export const getMyClaims = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (!userProfile) {
      return [];
    }

    const listings = await ctx.db
      .query("listings")
      .withIndex("by_claimer", (q) => q.eq("claimedBy", userProfile._id))
      .order("desc")
      .collect();

    return await Promise.all(
      listings.map(async (listing) => {
        const donor = await ctx.db.get(listing.donorId);
        return {
          ...listing,
          donor: donor ? { name: donor.name, organization: donor.organization } : null,
        };
      })
    );
  },
});

export const expireListing = internalMutation({
  args: { listingId: v.id("listings") },
  handler: async (ctx, args) => {
    const listing = await ctx.db.get(args.listingId);
    if (listing && listing.status === "active") {
      await ctx.db.patch(args.listingId, { status: "expired" });
    }
  },
});

export const updateListing = mutation({
  args: {
    listingId: v.id("listings"),
    title: v.string(),
    description: v.string(),
    category: v.union(
      v.literal("prepared_food"),
      v.literal("produce"),
      v.literal("packaged_goods"),
      v.literal("baked_goods"),
      v.literal("other")
    ),
    quantity: v.optional(v.string()),
    quantityNumber: v.number(),
    quantityUnit: v.string(),
    pickupTimeStart: v.number(),
    pickupTimeEnd: v.number(),
    address: v.string(), // Required for updates too
    zipCode: v.string(),
    source: v.optional(v.string()),
    photoUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (!userProfile) {
      throw new Error("Profile not found");
    }

    const listing = await ctx.db.get(args.listingId);
    if (!listing || listing.donorId !== userProfile._id) {
      throw new Error("Listing not found or not authorized");
    }

    if (listing.status !== "active") {
      throw new Error("Cannot edit claimed or completed listings");
    }

    // Calculate new available quantity based on the difference
    const quantityDifference = args.quantityNumber - (listing.totalQuantity || 0);
    const newAvailableQuantity = Math.max(0, (listing.availableQuantity || 0) + quantityDifference);

    await ctx.db.patch(args.listingId, {
      title: args.title,
      description: args.description,
      category: args.category,
      quantity: args.quantity || `${args.quantityNumber} ${args.quantityUnit}`,
      quantityNumber: args.quantityNumber,
      quantityUnit: args.quantityUnit,
      totalQuantity: args.quantityNumber,
      availableQuantity: newAvailableQuantity,
      pickupTimeStart: args.pickupTimeStart,
      pickupTimeEnd: args.pickupTimeEnd,
      address: args.address,
      zipCode: args.zipCode,
      source: args.source,
      photoUrl: args.photoUrl,
    });

    return args.listingId;
  },
});

export const deleteListing = mutation({
  args: { listingId: v.id("listings") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (!userProfile) {
      throw new Error("Profile not found");
    }

    const listing = await ctx.db.get(args.listingId);
    if (!listing || listing.donorId !== userProfile._id) {
      throw new Error("Listing not found or not authorized");
    }

    await ctx.db.delete(args.listingId);
  },
});
