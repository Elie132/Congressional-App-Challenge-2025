import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const sendMessage = mutation({
  args: {
    claimId: v.id("claims"),
    content: v.string(),
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
    if (!claim) {
      throw new Error("Claim not found");
    }

    // Verify user is part of this claim
    if (claim.donorId !== userProfile._id && claim.receiverId !== userProfile._id) {
      throw new Error("Not authorized to send messages in this claim");
    }

    return await ctx.db.insert("messages", {
      claimId: args.claimId,
      senderId: userProfile._id,
      content: args.content,
    });
  },
});

export const getMessages = query({
  args: { claimId: v.id("claims") },
  handler: async (ctx, args) => {
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

    const claim = await ctx.db.get(args.claimId);
    if (!claim) {
      return [];
    }

    // Verify user is part of this claim
    if (claim.donorId !== userProfile._id && claim.receiverId !== userProfile._id) {
      return [];
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_claim", (q) => q.eq("claimId", args.claimId))
      .order("asc")
      .collect();

    return await Promise.all(
      messages.map(async (message) => {
        const sender = await ctx.db.get(message.senderId);
        return {
          ...message,
          sender: sender ? { name: sender.name } : null,
        };
      })
    );
  },
});
