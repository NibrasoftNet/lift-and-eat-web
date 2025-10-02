// convex/mutations/plans.ts
// Owner-only mutations for Plans Cloud (SoT Convex)

import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    name: v.string(),
    goal: v.optional(v.string()),
    unit: v.optional(v.string()),
    initialWeight: v.optional(v.number()),
    targetWeight: v.optional(v.number()),
    calories: v.optional(v.number()),
    carbs: v.optional(v.number()),
    fat: v.optional(v.number()),
    protein: v.optional(v.number()),
    durationWeeks: v.optional(v.number()),
    startDate: v.optional(v.string()), // YYYY-MM-DD
    current: v.optional(v.boolean()),
    completed: v.optional(v.boolean()),
    clientId: v.optional(v.string()), // idempotence key per user
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const userId = identity.subject;

    // Idempotence by (userId, clientId)
    if (args.clientId) {
      const existing = await ctx.db
        .query("plans")
        .withIndex("by_user_clientId", (q) => q.eq("userId", userId).eq("clientId", args.clientId!))
        .collect();
      if (existing.length > 0) {
        // Optionally patch updatedAt if any different fields provided
        const now = Date.now();
        await ctx.db.patch(existing[0]._id, { updatedAt: now });
        return { id: existing[0]._id, reused: true } as const;
        }
    }

    const now = Date.now();
    const id = await ctx.db.insert("plans", {
      userId,
      name: args.name,
      goal: args.goal,
      unit: args.unit,
      initialWeight: args.initialWeight,
      targetWeight: args.targetWeight,
      calories: args.calories,
      carbs: args.carbs,
      fat: args.fat,
      protein: args.protein,
      durationWeeks: args.durationWeeks,
      startDate: args.startDate,
      // Force current=false at creation; only setCurrent can toggle it
      current: false,
      completed: !!args.completed,
      clientId: args.clientId,
      createdAt: now,
      updatedAt: now,
    });

    return { id, reused: false } as const;
  },
});

export const update = mutation({
  args: {
    planId: v.id("plans"),
    name: v.optional(v.string()),
    goal: v.optional(v.string()),
    unit: v.optional(v.string()),
    initialWeight: v.optional(v.number()),
    targetWeight: v.optional(v.number()),
    calories: v.optional(v.number()),
    carbs: v.optional(v.number()),
    fat: v.optional(v.number()),
    protein: v.optional(v.number()),
    durationWeeks: v.optional(v.number()),
    startDate: v.optional(v.string()),
    current: v.optional(v.boolean()),
    completed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const userId = identity.subject;

    const plan = await ctx.db.get(args.planId);
    if (!plan) throw new Error("Plan not found");
    if (plan.userId !== userId) throw new Error("Forbidden");

    const { planId, current: _ignoreCurrent, ...rest } = args as any;
    const patch: Record<string, any> = { updatedAt: Date.now() };
    for (const [k, vval] of Object.entries(rest)) {
      if (vval !== undefined) patch[k] = vval;
    }
    await ctx.db.patch(args.planId, patch);
    return { id: args.planId } as const;
  },
});

export const setCurrent = mutation({
  args: { planId: v.id("plans") },
  handler: async (ctx, { planId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const userId = identity.subject;

    const plan = await ctx.db.get(planId);
    if (!plan) throw new Error("Plan not found");
    if (plan.userId !== userId) throw new Error("Forbidden");

    // Unset current on other plans of this user
    const all = await ctx.db
      .query("plans")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const p of all) {
      const shouldBeCurrent = p._id === planId;
      if ((p.current ?? false) !== shouldBeCurrent) {
        await ctx.db.patch(p._id, { current: shouldBeCurrent, updatedAt: Date.now() });
      }
    }
    return { id: planId } as const;
  },
});

export const remove = mutation({
  args: { planId: v.id("plans") },
  handler: async (ctx, { planId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const userId = identity.subject;

    const plan = await ctx.db.get(planId);
    if (!plan) throw new Error("Plan not found");
    if (plan.userId !== userId) throw new Error("Forbidden");

    // Delete plan_days
    const days = await ctx.db
      .query("plan_days")
      .withIndex("by_plan", (q) => q.eq("planId", planId))
      .collect();
    for (const d of days) {
      await ctx.db.delete(d._id);
    }

    // Delete plan_entries scoped to this plan (for this user)
    const entries = await ctx.db
      .query("plan_entries")
      .withIndex("by_user_plan", (q) => q.eq("userId", userId).eq("planId", planId))
      .collect();
    for (const e of entries) {
      await ctx.db.delete(e._id);
    }

    // Finally delete plan
    await ctx.db.delete(planId);
    return { removed: true } as const;
  },
});
