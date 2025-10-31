import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const reportListing = mutation({
  args: {
    listingId: v.id("listings"),
    reason: v.union(
      v.literal("expired"),
      v.literal("inappropriate"),
      v.literal("spam"),
      v.literal("other")
    ),
    description: v.optional(v.string()),
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
    if (!listing) {
      throw new Error("Listing not found");
    }

    return await ctx.db.insert("reports", {
      listingId: args.listingId,
      reporterId: userProfile._id,
      reason: args.reason,
      description: args.description,
      status: "pending",
    });
  },
});

export const getReports = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    // For now, anyone can view reports - in production you'd want admin roles
    const reports = await ctx.db
      .query("reports")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .order("desc")
      .collect();

    return await Promise.all(
      reports.map(async (report) => {
        const listing = await ctx.db.get(report.listingId);
        const reporter = await ctx.db.get(report.reporterId);
        return {
          ...report,
          listing,
          reporter: reporter ? { name: reporter.name } : null,
        };
      })
    );
  },
});
