// convex/queries/plans.ts
// Owner-only queries for listing user plans and fetching plan details (with days)

import { query } from "../_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const userId = identity.subject;

    const rows = await ctx.db
      .query("plans")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return rows;
  },
});

export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const userId = identity.subject;

    const current = await ctx.db
      .query("plans")
      .withIndex("by_user_current", (q) => q.eq("userId", userId).eq("current", true))
      .collect();

    return current[0] ?? null;
  },
});

export const getDetails = query({
  args: { planId: v.id("plans") },
  handler: async (ctx, { planId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const userId = identity.subject;

    const plan = await ctx.db.get(planId);
    if (!plan) throw new Error("Plan not found");
    if (plan.userId !== userId) throw new Error("Forbidden");

    const days = await ctx.db
      .query("plan_days")
      .withIndex("by_plan", (q) => q.eq("planId", planId))
      .collect();

    return { plan, days } as const;
  },
});
