import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createUserProfile = mutation({
  args: {
    name: v.optional(v.string()),
    role: v.union(v.literal("donor"), v.literal("receiver")),
    address: v.optional(v.string()),
    zipCode: v.string(),
    phone: v.optional(v.string()),
    organization: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Check if profile already exists
    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (existingProfile) {
      throw new Error("Profile already exists");
    }

    return await ctx.db.insert("userProfiles", {
      userId: userId,
      email: user.email!,
      name: args.name || args.organization || "Anonymous User",
      role: args.role,
      address: args.address,
      zipCode: args.zipCode,
      phone: args.phone,
      organization: args.organization,
    });
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    return userProfile;
  },
});

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    address: v.optional(v.string()),
    zipCode: v.string(),
    phone: v.optional(v.string()),
    organization: v.optional(v.string()),
    role: v.optional(v.union(v.literal("donor"), v.literal("receiver"))),
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

    const updateData: any = {
      name: args.name || args.organization || userProfile.name,
      address: args.address,
      zipCode: args.zipCode,
      phone: args.phone,
      organization: args.organization,
    };

    if (args.role) {
      updateData.role = args.role;
    }

    await ctx.db.patch(userProfile._id, updateData);

    return userProfile._id;
  },
});
