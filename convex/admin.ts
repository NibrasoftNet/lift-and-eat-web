import { query } from "./_generated/server";
import { v } from "convex/values";

export const getUserProfile = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
  },
});

export const getUserPlans = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db
      .query("plans")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const getUserEntries = query({
  args: { userId: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const items = await ctx.db
      .query("plan_entries")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const sorted = items.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
    const limit = args.limit ?? 25;
    return sorted.slice(0, limit);
  },
});

export const getUserSavedMeals = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db
      .query("saved_meals")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});
