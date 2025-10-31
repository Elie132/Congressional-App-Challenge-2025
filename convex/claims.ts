import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createClaim = mutation({
  args: {
    listingId: v.id("listings"),
    quantityClaimed: v.optional(v.number()), // How many units they want
    message: v.optional(v.string()),
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

    if (!userProfile || userProfile.role !== "receiver") {
      throw new Error("Only receivers can claim listings");
    }

    const listing = await ctx.db.get(args.listingId);
    if (!listing || listing.status !== "active") {
      throw new Error("Listing not available");
    }

    // Check available quantity
    const availableQuantity = listing.availableQuantity || listing.totalQuantity || 1;
    const requestedQuantity = args.quantityClaimed || 1;

    if (requestedQuantity > availableQuantity) {
      throw new Error(`Only ${availableQuantity} ${listing.quantityUnit || 'units'} available`);
    }

    // Check if user already has a pending/accepted claim for this listing
    const existingClaim = await ctx.db
      .query("claims")
      .withIndex("by_listing", (q) => q.eq("listingId", args.listingId))
      .filter((q) => q.eq(q.field("receiverId"), userProfile._id))
      .filter((q) => q.or(q.eq(q.field("status"), "pending"), q.eq(q.field("status"), "accepted")))
      .first();

    if (existingClaim) {
      throw new Error("You already have a pending or accepted claim for this listing");
    }

    const claimId = await ctx.db.insert("claims", {
      listingId: args.listingId,
      receiverId: userProfile._id,
      donorId: listing.donorId,
      quantityClaimed: requestedQuantity,
      status: "pending",
      message: args.message,
    });

    // Update available quantity (don't change status to claimed yet - wait for donor approval)
    const newAvailableQuantity = availableQuantity - requestedQuantity;

    // If no quantity left, mark as claimed
    if (newAvailableQuantity <= 0) {
      await ctx.db.patch(args.listingId, {
        status: "claimed",
        availableQuantity: 0,
        claimedBy: userProfile._id, // Keep for backward compatibility
        claimedAt: Date.now(),
      });
    } else {
      await ctx.db.patch(args.listingId, {
        availableQuantity: newAvailableQuantity,
      });
    }

    return claimId;
  },
});

export const respondToClaim = mutation({
  args: {
    claimId: v.id("claims"),
    response: v.union(v.literal("accepted"), v.literal("rejected")),
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

    const claim = await ctx.db.get(args.claimId);
    if (!claim || claim.donorId !== userProfile._id) {
      throw new Error("Claim not found or not authorized");
    }

    await ctx.db.patch(args.claimId, { status: args.response });

    if (args.response === "rejected") {
      // Reset listing to active if rejected
      await ctx.db.patch(claim.listingId, {
        status: "active",
        claimedBy: undefined,
        claimedAt: undefined,
      });
    }

    return claim;
  },
});

export const getClaimsForDonor = query({
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

    const claims = await ctx.db
      .query("claims")
      .withIndex("by_donor", (q) => q.eq("donorId", userProfile._id))
      .order("desc")
      .collect();

    return await Promise.all(
      claims.map(async (claim) => {
        const listing = await ctx.db.get(claim.listingId);
        const receiver = await ctx.db.get(claim.receiverId);
        return {
          ...claim,
          listing,
          receiver: receiver ? { name: receiver.name, organization: receiver.organization } : null,
        };
      })
    );
  },
});

export const completeClaim = mutation({
  args: { claimId: v.id("claims") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const claim = await ctx.db.get(args.claimId);
    if (!claim) {
      throw new Error("Claim not found");
    }

    await ctx.db.patch(args.claimId, { status: "completed" });
    await ctx.db.patch(claim.listingId, { status: "completed" });

    return claim;
  },
});
